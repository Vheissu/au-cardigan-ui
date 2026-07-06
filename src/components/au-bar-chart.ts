import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import ChartStyles from './chart-base.css';
import { AuChartBase, ChartDatum, ChartLegendItem, ChartSeries, formatNumber, niceScale, toBool } from './chart-base';
import styles from './au-bar-chart.css';
import template from './au-bar-chart.html';

interface NormalizedSeries {
    name: string;
    color: string;
    values: number[];
    barColors?: string[];
}

@customElement({
    name: 'au-bar-chart',
    template,
    dependencies: [shadowCSS(SharedStyles, ChartStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuBarChartCustomElement extends AuChartBase implements ICustomElementViewModel {
    @bindable public data: ChartDatum[] = [];
    @bindable public series: ChartSeries[] = [];
    @bindable public labels: string[] = [];
    @bindable public horizontal: boolean = false;
    @bindable public stacked: boolean = false;
    @bindable public showValues: boolean = false;
    @bindable public yTicks: number = 5;
    @bindable public grid: boolean = true;

    public dataChanged(): void {
        this.animateNextRender = true;
        this.requestRender();
    }

    public seriesChanged(): void {
        this.animateNextRender = true;
        this.requestRender();
    }

    public labelsChanged(): void {
        this.requestRender();
    }

    public horizontalChanged(): void {
        this.requestRender();
    }

    public stackedChanged(): void {
        this.requestRender();
    }

    public showValuesChanged(): void {
        this.requestRender();
    }

    public yTicksChanged(): void {
        this.requestRender();
    }

    public gridChanged(): void {
        this.requestRender();
    }

    public get legendItems(): ChartLegendItem[] {
        if (this.isSeriesMode) {
            return this.seriesInput.map((series, index) => ({
                label: series?.name ?? `Series ${index + 1}`,
                color: series?.color ?? this.colorAt(index),
            }));
        }
        return this.dataInput.map((datum, index) => ({
            label: datum?.label ?? `Item ${index + 1}`,
            color: datum?.color ?? this.colorAt(index),
        }));
    }

    public get tableHeaders(): string[] {
        if (this.isSeriesMode) {
            return ['Label', ...this.seriesInput.map((series, index) => series?.name ?? `Series ${index + 1}`)];
        }
        return ['Label', 'Value'];
    }

    public get tableRows(): (string | number)[][] {
        if (this.isSeriesMode) {
            const seriesList = this.seriesInput;
            return this.categoryLabels.map((label, index) =>
                [label, ...seriesList.map(series => series?.values?.[index] ?? 0)]);
        }
        return this.dataInput.map(datum => [datum?.label ?? '', datum?.value ?? 0]);
    }

    protected getDataSummary(): string {
        if (this.isSeriesMode) {
            const names = this.seriesInput.map((series, index) => series?.name ?? `Series ${index + 1}`);
            return `Bar chart with ${names.length} series (${names.join(', ')}) across ${this.categoryLabels.length} categories`;
        }
        const items = this.dataInput.map(datum => `${datum?.label ?? ''} ${formatNumber(datum?.value ?? 0)}`);
        return items.length > 0 ? `Bar chart: ${items.join(', ')}` : 'Bar chart with no data';
    }

    protected draw(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void {
        const categories = this.categoryLabels;
        const seriesList = this.normalizedSeries;
        if (categories.length === 0 || seriesList.length === 0) {
            return;
        }

        const horizontal = toBool(this.horizontal, false);
        const stacked = toBool(this.stacked, false) && this.isSeriesMode;
        const showValues = toBool(this.showValues, false);
        const showGrid = toBool(this.grid, true);

        const scale = this.computeScale(seriesList, stacked);
        const span = scale.max - scale.min || 1;
        const tickLabels = scale.ticks.map(formatNumber);

        ctx.font = this.font(12);
        const measure = (text: string) => {
            try {
                const metrics = typeof ctx.measureText === 'function' ? ctx.measureText(text) : null;
                return metrics != null && Number.isFinite(metrics.width) ? metrics.width : text.length * 7;
            } catch {
                return text.length * 7;
            }
        };
        const maxTickWidth = tickLabels.reduce((max, label) => Math.max(max, measure(label)), 0);
        const maxCategoryWidth = categories.reduce((max, label) => Math.max(max, measure(label)), 0);

        const padTop = !horizontal && showValues ? 20 : 10;
        const padRight = horizontal && showValues ? 40 : 12;
        const padLeft = (horizontal ? maxCategoryWidth : maxTickWidth) + 10;
        const padBottom = 24;
        const plotX = padLeft;
        const plotY = padTop;
        const plotW = width - padLeft - padRight;
        const plotH = height - padTop - padBottom;
        if (plotW <= 0 || plotH <= 0) {
            return;
        }

        const valuePos = (value: number) => horizontal
            ? plotX + ((value - scale.min) / span) * plotW
            : plotY + plotH - ((value - scale.min) / span) * plotH;

        const gridColor = this.themeColor('--color-lightGrey', '#CED4DA');
        const textColor = this.themeColor('--color-mediumGrey', '#495057');

        // Gridlines and value tick labels.
        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        for (let i = 0; i < scale.ticks.length; i++) {
            const pos = valuePos(scale.ticks[i]);
            if (showGrid && typeof ctx.beginPath === 'function') {
                ctx.beginPath();
                if (horizontal) {
                    ctx.moveTo(pos, plotY);
                    ctx.lineTo(pos, plotY + plotH);
                } else {
                    ctx.moveTo(plotX, pos);
                    ctx.lineTo(plotX + plotW, pos);
                }
                ctx.stroke();
            }
            if (horizontal) {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(tickLabels[i], pos, plotY + plotH + 6);
            } else {
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(tickLabels[i], plotX - 6, pos);
            }
        }

        // Category labels.
        const band = (horizontal ? plotH : plotW) / categories.length;
        ctx.fillStyle = textColor;
        for (let i = 0; i < categories.length; i++) {
            const center = (horizontal ? plotY : plotX) + band * i + band / 2;
            if (horizontal) {
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(categories[i], plotX - 6, center);
            } else {
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText(categories[i], center, plotY + plotH + 6);
            }
        }

        // Bars.
        const inner = band * 0.7;
        const groupCount = stacked ? 1 : seriesList.length;
        const gap = groupCount > 1 ? 2 : 0;
        const barSize = Math.max(1, (inner - gap * (groupCount - 1)) / groupCount);
        const zeroPos = valuePos(Math.max(scale.min, Math.min(scale.max, 0)));

        for (let ci = 0; ci < categories.length; ci++) {
            const bandStart = (horizontal ? plotY : plotX) + band * ci + (band - inner) / 2;
            let positive = 0;
            let negative = 0;
            for (let si = 0; si < seriesList.length; si++) {
                const series = seriesList[si];
                const value = Number(series.values[ci]) || 0;
                const animated = value * progress;
                let from: number;
                let to: number;
                if (stacked) {
                    if (animated >= 0) {
                        from = positive;
                        positive += animated;
                        to = positive;
                    } else {
                        from = negative;
                        negative += animated;
                        to = negative;
                    }
                } else {
                    from = 0;
                    to = animated;
                }
                const crossStart = stacked ? bandStart : bandStart + si * (barSize + gap);
                const fromPos = from === 0 ? zeroPos : valuePos(from);
                const toPos = valuePos(to);
                const color = series.barColors?.[ci] ?? series.color;
                if (horizontal) {
                    this.fillBar(ctx, Math.min(fromPos, toPos), crossStart, Math.abs(toPos - fromPos), barSize, color, !stacked);
                } else {
                    this.fillBar(ctx, crossStart, Math.min(fromPos, toPos), barSize, Math.abs(toPos - fromPos), color, !stacked);
                }

                if (showValues && !stacked) {
                    this.drawValueLabel(ctx, formatNumber(value), horizontal, value >= 0, toPos, crossStart + barSize / 2, textColor);
                }
            }
            if (showValues && stacked) {
                const total = seriesList.reduce((sum, series) => sum + (Number(series.values[ci]) || 0), 0);
                this.drawValueLabel(ctx, formatNumber(total), horizontal, total >= 0, valuePos(total * progress), bandStart + inner / 2, textColor);
            }
        }
    }

    private drawValueLabel(
        ctx: CanvasRenderingContext2D,
        text: string,
        horizontal: boolean,
        positive: boolean,
        endPos: number,
        crossCenter: number,
        color: string
    ): void {
        ctx.fillStyle = color;
        ctx.font = this.font(11);
        if (horizontal) {
            ctx.textAlign = positive ? 'left' : 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, endPos + (positive ? 4 : -4), crossCenter);
        } else {
            ctx.textAlign = 'center';
            ctx.textBaseline = positive ? 'bottom' : 'top';
            ctx.fillText(text, crossCenter, endPos + (positive ? -4 : 4));
        }
    }

    private fillBar(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        barWidth: number,
        barHeight: number,
        color: string,
        rounded: boolean
    ): void {
        if (barWidth <= 0 || barHeight <= 0) {
            return;
        }
        ctx.fillStyle = color;
        const radius = rounded ? Math.min(3, barWidth / 2, barHeight / 2) : 0;
        const roundRect = (ctx as CanvasRenderingContext2D & { roundRect?: (...args: unknown[]) => void }).roundRect;
        if (radius > 0 && typeof roundRect === 'function' && typeof ctx.beginPath === 'function' && typeof ctx.fill === 'function') {
            ctx.beginPath();
            roundRect.call(ctx, x, y, barWidth, barHeight, radius);
            ctx.fill();
        } else if (typeof ctx.fillRect === 'function') {
            ctx.fillRect(x, y, barWidth, barHeight);
        }
    }

    private computeScale(seriesList: NormalizedSeries[], stacked: boolean) {
        let min = 0;
        let max = 0;
        const categoryCount = this.categoryLabels.length;
        if (stacked) {
            for (let ci = 0; ci < categoryCount; ci++) {
                let positive = 0;
                let negative = 0;
                for (const series of seriesList) {
                    const value = Number(series.values[ci]) || 0;
                    if (value >= 0) {
                        positive += value;
                    } else {
                        negative += value;
                    }
                }
                max = Math.max(max, positive);
                min = Math.min(min, negative);
            }
        } else {
            for (const series of seriesList) {
                for (const value of series.values) {
                    const numeric = Number(value) || 0;
                    max = Math.max(max, numeric);
                    min = Math.min(min, numeric);
                }
            }
        }
        return niceScale(min, max, this.tickCount);
    }

    private get tickCount(): number {
        const value = Number(this.yTicks);
        return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 5;
    }

    private get dataInput(): ChartDatum[] {
        return Array.isArray(this.data) ? this.data : [];
    }

    private get seriesInput(): ChartSeries[] {
        return Array.isArray(this.series) ? this.series : [];
    }

    private get isSeriesMode(): boolean {
        return this.seriesInput.length > 0;
    }

    private get categoryLabels(): string[] {
        if (this.isSeriesMode) {
            const count = this.seriesInput.reduce((max, series) => Math.max(max, series?.values?.length ?? 0), 0);
            const labels = Array.isArray(this.labels) ? this.labels : [];
            return Array.from({ length: count }, (_, index) => labels[index] ?? `${index + 1}`);
        }
        return this.dataInput.map((datum, index) => datum?.label ?? `${index + 1}`);
    }

    private get normalizedSeries(): NormalizedSeries[] {
        if (this.isSeriesMode) {
            return this.seriesInput.map((series, index) => ({
                name: series?.name ?? `Series ${index + 1}`,
                color: series?.color ?? this.colorAt(index),
                values: Array.isArray(series?.values) ? series.values : [],
            }));
        }
        const data = this.dataInput;
        if (data.length === 0) {
            return [];
        }
        return [{
            name: 'Values',
            color: this.colorAt(0),
            values: data.map(datum => Number(datum?.value) || 0),
            barColors: data.map((datum, index) => datum?.color ?? this.colorAt(index)),
        }];
    }
}
