import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import ChartStyles from './chart-base.css';
import { AuChartBase, ChartDatum, ChartLegendItem, formatNumber, toBool } from './chart-base';
import styles from './au-doughnut-chart.css';
import template from './au-doughnut-chart.html';

@customElement({
    name: 'au-doughnut-chart',
    template,
    dependencies: [shadowCSS(SharedStyles, ChartStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuDoughnutChartCustomElement extends AuChartBase implements ICustomElementViewModel {
    @bindable public data: ChartDatum[] = [];
    @bindable public cutout: number = 0.6;
    @bindable public startAngle: number = -90;
    @bindable public showValues: boolean = false;
    @bindable public centerLabel: string = '';
    @bindable public centerValue: string = '';

    public dataChanged(): void {
        this.animateNextRender = true;
        this.requestRender();
    }

    public cutoutChanged(): void {
        this.requestRender();
    }

    public startAngleChanged(): void {
        this.requestRender();
    }

    public showValuesChanged(): void {
        this.requestRender();
    }

    public get legendItems(): ChartLegendItem[] {
        return this.entries.map((datum, index) => ({
            label: datum?.label ?? `Item ${index + 1}`,
            color: datum?.color ?? this.colorAt(index),
        }));
    }

    public get tableHeaders(): string[] {
        return ['Label', 'Value', 'Percentage'];
    }

    public get tableRows(): (string | number)[][] {
        const total = this.total;
        return this.entries.map(datum => {
            const value = Number(datum?.value) || 0;
            const percentage = total > 0 ? `${formatNumber((value / total) * 100)}%` : '0%';
            return [datum?.label ?? '', value, percentage];
        });
    }

    protected getDataSummary(): string {
        const entries = this.entries;
        if (entries.length === 0) {
            return 'Doughnut chart with no data';
        }
        const total = this.total;
        const items = entries.map(datum => {
            const value = Number(datum?.value) || 0;
            const percentage = total > 0 ? ` (${formatNumber((value / total) * 100)}%)` : '';
            return `${datum?.label ?? ''} ${formatNumber(value)}${percentage}`;
        });
        return `Doughnut chart: ${items.join(', ')}`;
    }

    protected draw(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void {
        const entries = this.entries;
        const total = this.total;
        if (entries.length === 0 || total <= 0) {
            return;
        }
        if (typeof ctx.arc !== 'function' || typeof ctx.beginPath !== 'function') {
            return;
        }

        const centerX = width / 2;
        const centerY = height / 2;
        const outerRadius = Math.max(1, Math.min(width, height) / 2 - 8);
        const innerRadius = outerRadius * this.cutoutRatio;
        const startRad = (this.startAngleDegrees * Math.PI) / 180;
        const showValues = toBool(this.showValues, false);

        let angle = startRad;
        for (let i = 0; i < entries.length; i++) {
            const datum = entries[i];
            const value = Math.max(0, Number(datum?.value) || 0);
            const sweep = (value / total) * Math.PI * 2 * progress;
            if (sweep <= 0) {
                continue;
            }
            const endAngle = angle + sweep;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, angle, endAngle);
            if (innerRadius > 0) {
                ctx.arc(centerX, centerY, innerRadius, endAngle, angle, true);
            } else {
                ctx.lineTo(centerX, centerY);
            }
            if (typeof ctx.closePath === 'function') {
                ctx.closePath();
            }
            ctx.fillStyle = datum?.color ?? this.colorAt(i);
            ctx.fill();

            // Percentage labels on segments that are wide enough to fit them.
            if (showValues && sweep > 0.35) {
                const midAngle = angle + sweep / 2;
                const labelRadius = innerRadius > 0 ? (innerRadius + outerRadius) / 2 : outerRadius * 0.6;
                ctx.fillStyle = this.themeColor('--color-white', '#FFFFFF');
                ctx.font = this.font(12, '600');
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    `${formatNumber((value / total) * 100)}%`,
                    centerX + Math.cos(midAngle) * labelRadius,
                    centerY + Math.sin(midAngle) * labelRadius
                );
            }
            angle = endAngle;
        }
    }

    private get entries(): ChartDatum[] {
        const data = Array.isArray(this.data) ? this.data : [];
        return data.filter(datum => (Number(datum?.value) || 0) > 0);
    }

    private get total(): number {
        return this.entries.reduce((sum, datum) => sum + (Number(datum?.value) || 0), 0);
    }

    private get cutoutRatio(): number {
        const value = Number(this.cutout);
        if (!Number.isFinite(value)) {
            return 0.6;
        }
        return Math.min(0.9, Math.max(0, value));
    }

    private get startAngleDegrees(): number {
        const value = Number(this.startAngle);
        return Number.isFinite(value) ? value : -90;
    }
}
