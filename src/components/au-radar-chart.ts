import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import ChartStyles from './chart-base.css';
import { AuChartBase, ChartLegendItem, ChartSeries, formatNumber, hexToRgba, niceScale, toBool } from './chart-base';
import styles from './au-radar-chart.css';
import template from './au-radar-chart.html';

@customElement({
    name: 'au-radar-chart',
    template,
    dependencies: [shadowCSS(SharedStyles, ChartStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuRadarChartCustomElement extends AuChartBase implements ICustomElementViewModel {
    @bindable public labels: string[] = [];
    @bindable public series: ChartSeries[] = [];
    @bindable public max?: number;
    @bindable public levels: number = 5;
    @bindable public fill: boolean = true;

    public labelsChanged(): void {
        this.requestRender();
    }

    public seriesChanged(): void {
        this.animateNextRender = true;
        this.requestRender();
    }

    public maxChanged(): void {
        this.requestRender();
    }

    public levelsChanged(): void {
        this.requestRender();
    }

    public fillChanged(): void {
        this.requestRender();
    }

    public get legendItems(): ChartLegendItem[] {
        return this.seriesInput.map((series, index) => ({
            label: series?.name ?? `Series ${index + 1}`,
            color: series?.color ?? this.colorAt(index),
        }));
    }

    public get tableHeaders(): string[] {
        return ['Axis', ...this.seriesInput.map((series, index) => series?.name ?? `Series ${index + 1}`)];
    }

    public get tableRows(): (string | number)[][] {
        const seriesList = this.seriesInput;
        return this.axisLabels.map((label, index) =>
            [label, ...seriesList.map(series => series?.values?.[index] ?? 0)]);
    }

    protected getDataSummary(): string {
        const axes = this.axisLabels;
        const seriesList = this.seriesInput;
        if (axes.length === 0 || seriesList.length === 0) {
            return 'Radar chart with no data';
        }
        const names = seriesList.map((series, index) => series?.name ?? `Series ${index + 1}`);
        return `Radar chart comparing ${names.join(', ')} across ${axes.length} axes (${axes.join(', ')})`;
    }

    protected draw(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void {
        const axes = this.axisLabels;
        const seriesList = this.seriesInput;
        if (axes.length < 3 || seriesList.length === 0) {
            return;
        }
        if (typeof ctx.beginPath !== 'function' || typeof ctx.moveTo !== 'function' || typeof ctx.lineTo !== 'function') {
            return;
        }

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.max(1, Math.min(width, height) / 2 - 32);
        const levels = this.levelCount;
        const maxValue = this.scaleMax;
        const angleFor = (index: number) => -Math.PI / 2 + (index * Math.PI * 2) / axes.length;
        const pointAt = (index: number, distance: number): [number, number] => [
            centerX + Math.cos(angleFor(index)) * distance,
            centerY + Math.sin(angleFor(index)) * distance,
        ];

        const gridColor = this.themeColor('--color-lightGrey', '#CED4DA');
        const textColor = this.themeColor('--color-mediumGrey', '#495057');

        // Concentric polygon rings.
        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor;
        for (let level = 1; level <= levels; level++) {
            const ringRadius = (radius * level) / levels;
            ctx.beginPath();
            for (let i = 0; i < axes.length; i++) {
                const [x, y] = pointAt(i, ringRadius);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            if (typeof ctx.closePath === 'function') {
                ctx.closePath();
            }
            ctx.stroke();
        }

        // Spokes and axis labels.
        ctx.font = this.font(12);
        for (let i = 0; i < axes.length; i++) {
            const [x, y] = pointAt(i, radius);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = gridColor;
            ctx.stroke();

            const [labelX, labelY] = pointAt(i, radius + 10);
            const cos = Math.cos(angleFor(i));
            const sin = Math.sin(angleFor(i));
            ctx.fillStyle = textColor;
            ctx.textAlign = cos > 0.1 ? 'left' : cos < -0.1 ? 'right' : 'center';
            ctx.textBaseline = sin > 0.1 ? 'top' : sin < -0.1 ? 'bottom' : 'middle';
            ctx.fillText(axes[i], labelX, labelY);
        }

        // Ring value labels along the vertical axis.
        ctx.fillStyle = textColor;
        ctx.font = this.font(10);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        for (let level = 1; level <= levels; level++) {
            ctx.fillText(formatNumber((maxValue * level) / levels), centerX + 4, centerY - (radius * level) / levels);
        }

        // One polygon per series.
        const shouldFill = toBool(this.fill, true);
        ctx.lineWidth = 2;
        if ('lineJoin' in ctx) {
            ctx.lineJoin = 'round';
        }
        for (let si = 0; si < seriesList.length; si++) {
            const series = seriesList[si];
            const color = series?.color ?? this.colorAt(si);
            ctx.beginPath();
            for (let i = 0; i < axes.length; i++) {
                const value = Math.max(0, Number(series?.values?.[i]) || 0);
                const distance = Math.min(1, value / maxValue) * radius * progress;
                const [x, y] = pointAt(i, distance);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            if (typeof ctx.closePath === 'function') {
                ctx.closePath();
            }
            if (shouldFill && typeof ctx.fill === 'function') {
                ctx.fillStyle = hexToRgba(color, 0.25);
                ctx.fill();
            }
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    private get axisLabels(): string[] {
        return Array.isArray(this.labels) ? this.labels : [];
    }

    private get seriesInput(): ChartSeries[] {
        return Array.isArray(this.series) ? this.series : [];
    }

    private get levelCount(): number {
        const value = Number(this.levels);
        return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 5;
    }

    /** Fixed max when bound, otherwise a derived nice max over all series values. */
    private get scaleMax(): number {
        const fixed = Number(this.max);
        if (Number.isFinite(fixed) && fixed > 0) {
            return fixed;
        }
        let dataMax = 0;
        for (const series of this.seriesInput) {
            for (const value of series?.values ?? []) {
                dataMax = Math.max(dataMax, Number(value) || 0);
            }
        }
        return niceScale(0, dataMax || 1, this.levelCount).max || 1;
    }
}
