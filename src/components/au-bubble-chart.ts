import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import ChartStyles from './chart-base.css';
import { AuChartBase, BubblePoint, ChartLegendItem, formatNumber, hexToRgba, niceScale, toBool } from './chart-base';
import styles from './au-bubble-chart.css';
import template from './au-bubble-chart.html';

@customElement({
    name: 'au-bubble-chart',
    template,
    dependencies: [shadowCSS(SharedStyles, ChartStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuBubbleChartCustomElement extends AuChartBase implements ICustomElementViewModel {
    @bindable public data: BubblePoint[] = [];
    @bindable public xLabel: string = '';
    @bindable public yLabel: string = '';
    @bindable public grid: boolean = true;
    @bindable public xTicks: number = 5;
    @bindable public yTicks: number = 5;

    public dataChanged(): void {
        this.animateNextRender = true;
        this.requestRender();
    }

    public xLabelChanged(): void {
        this.requestRender();
    }

    public yLabelChanged(): void {
        this.requestRender();
    }

    public gridChanged(): void {
        this.requestRender();
    }

    public xTicksChanged(): void {
        this.requestRender();
    }

    public yTicksChanged(): void {
        this.requestRender();
    }

    public get legendItems(): ChartLegendItem[] {
        return this.points
            .map((point, index) => ({ point, index }))
            .filter(entry => !!entry.point?.label)
            .map(entry => ({
                label: entry.point.label as string,
                color: entry.point.color ?? this.colorAt(entry.index),
            }));
    }

    public get tableHeaders(): string[] {
        return ['Label', this.xLabel || 'X', this.yLabel || 'Y', 'Size'];
    }

    public get tableRows(): (string | number)[][] {
        return this.points.map((point, index) => [
            point?.label ?? `Point ${index + 1}`,
            point?.x ?? 0,
            point?.y ?? 0,
            point?.r ?? 0,
        ]);
    }

    protected getDataSummary(): string {
        const count = this.points.length;
        if (count === 0) {
            return 'Bubble chart with no data';
        }
        const axes = [this.xLabel, this.yLabel].filter(Boolean).join(' by ');
        return `Bubble chart with ${count} point${count === 1 ? '' : 's'}${axes ? ` plotting ${axes}` : ''}`;
    }

    protected draw(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void {
        const points = this.points;
        if (points.length === 0) {
            return;
        }

        const showGrid = toBool(this.grid, true);
        const xs = points.map(point => Number(point?.x) || 0);
        const ys = points.map(point => Number(point?.y) || 0);
        const xScale = niceScale(Math.min(...xs), Math.max(...xs), this.tickCount(this.xTicks));
        const yScale = niceScale(Math.min(...ys), Math.max(...ys), this.tickCount(this.yTicks));
        const xSpan = xScale.max - xScale.min || 1;
        const ySpan = yScale.max - yScale.min || 1;

        ctx.font = this.font(12);
        const measure = (text: string) => {
            try {
                const metrics = typeof ctx.measureText === 'function' ? ctx.measureText(text) : null;
                return metrics != null && Number.isFinite(metrics.width) ? metrics.width : text.length * 7;
            } catch {
                return text.length * 7;
            }
        };
        const yTickLabels = yScale.ticks.map(formatNumber);
        const xTickLabels = xScale.ticks.map(formatNumber);
        const maxYTickWidth = yTickLabels.reduce((max, label) => Math.max(max, measure(label)), 0);

        const padLeft = maxYTickWidth + 10 + (this.yLabel ? 18 : 0);
        const padBottom = 24 + (this.xLabel ? 18 : 0);
        const padTop = 12;
        const padRight = 16;
        const plotX = padLeft;
        const plotY = padTop;
        const plotW = width - padLeft - padRight;
        const plotH = height - padTop - padBottom;
        if (plotW <= 0 || plotH <= 0) {
            return;
        }

        const xPos = (value: number) => plotX + ((value - xScale.min) / xSpan) * plotW;
        const yPos = (value: number) => plotY + plotH - ((value - yScale.min) / ySpan) * plotH;

        const gridColor = this.themeColor('--color-lightGrey', '#CED4DA');
        const textColor = this.themeColor('--color-mediumGrey', '#495057');

        // Gridlines and ticks.
        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor;
        ctx.fillStyle = textColor;
        for (let i = 0; i < yScale.ticks.length; i++) {
            const y = yPos(yScale.ticks[i]);
            if (showGrid && typeof ctx.beginPath === 'function') {
                ctx.beginPath();
                ctx.moveTo(plotX, y);
                ctx.lineTo(plotX + plotW, y);
                ctx.stroke();
            }
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(yTickLabels[i], plotX - 6, y);
        }
        for (let i = 0; i < xScale.ticks.length; i++) {
            const x = xPos(xScale.ticks[i]);
            if (showGrid && typeof ctx.beginPath === 'function') {
                ctx.beginPath();
                ctx.moveTo(x, plotY);
                ctx.lineTo(x, plotY + plotH);
                ctx.stroke();
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(xTickLabels[i], x, plotY + plotH + 6);
        }

        // Axis titles.
        ctx.fillStyle = textColor;
        ctx.font = this.font(12, '600');
        if (this.xLabel) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.xLabel, plotX + plotW / 2, height - 4);
        }
        if (this.yLabel && typeof ctx.save === 'function' && typeof ctx.translate === 'function' && typeof ctx.rotate === 'function') {
            ctx.save();
            ctx.translate(12, plotY + plotH / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.yLabel, 0, 0);
            ctx.restore();
        }

        // Bubbles: sqrt scale against the largest r, animated by progress.
        const maxR = points.reduce((max, point) => Math.max(max, Number(point?.r) || 0), 0) || 1;
        const maxRadius = Math.max(8, Math.min(plotW, plotH) * 0.08);
        if (typeof ctx.arc !== 'function' || typeof ctx.beginPath !== 'function') {
            return;
        }
        ctx.lineWidth = 1.5;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const radius = Math.sqrt(Math.max(0, Number(point?.r) || 0) / maxR) * maxRadius * progress;
            if (radius <= 0) {
                continue;
            }
            const color = point?.color ?? this.colorAt(i);
            ctx.beginPath();
            ctx.arc(xPos(Number(point?.x) || 0), yPos(Number(point?.y) || 0), radius, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(color, 0.35);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    private tickCount(raw: number): number {
        const value = Number(raw);
        return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 5;
    }

    private get points(): BubblePoint[] {
        return Array.isArray(this.data) ? this.data : [];
    }
}
