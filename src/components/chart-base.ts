import '../polyfills';
import { bindable } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

export interface ChartDatum {
    label: string;
    value: number;
    color?: string;
}

export interface ChartSeries {
    name: string;
    color?: string;
    values: number[];
}

export interface BubblePoint {
    x: number;
    y: number;
    r: number;
    label?: string;
    color?: string;
}

export interface ChartLegendItem {
    label: string;
    color: string;
}

export interface NiceScale {
    min: number;
    max: number;
    step: number;
    ticks: number[];
}

const ANIMATION_DURATION = 500;

const PALETTE_SOURCES: [string, string][] = [
    ['--color-primary', '#0466C8'],
    ['--color-success', '#52B788'],
    ['--color-bright', '#FF6B6B'],
    ['--color-purple', '#6610F2'],
    ['--color-info', '#00B4D8'],
    ['--color-error', '#DC3545'],
];

function parseHex(color: string): [number, number, number] | null {
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
    if (!match) {
        return null;
    }
    let hex = match[1];
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
    ];
}

/**
 * Mixes a hex colour toward white (positive amount) or black (negative amount).
 * Amount is 0..1. Non-hex input is returned untouched.
 */
export function shadeColor(color: string, amount: number): string {
    const rgb = parseHex(color);
    if (rgb == null) {
        return color;
    }
    const target = amount >= 0 ? 255 : 0;
    const factor = Math.min(1, Math.abs(amount));
    const channel = (c: number) => Math.round(c + (target - c) * factor);
    return `#${rgb.map(c => channel(c).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Converts a hex colour to an rgba() string. Non-hex input is returned untouched.
 */
export function hexToRgba(color: string, alpha: number): string {
    const rgb = parseHex(color);
    if (rgb == null) {
        return color;
    }
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

/**
 * Computes a "nice" axis scale using 1/2/5 x 10^n steps that covers [minValue, maxValue].
 */
export function niceScale(minValue: number, maxValue: number, tickCount = 5): NiceScale {
    let min = Number.isFinite(minValue) ? minValue : 0;
    let max = Number.isFinite(maxValue) ? maxValue : 1;
    if (min > max) {
        [min, max] = [max, min];
    }
    if (min === max) {
        if (min === 0) {
            max = 1;
        } else if (min > 0) {
            min = 0;
        } else {
            max = 0;
        }
    }
    const count = Math.max(1, Math.floor(tickCount) || 1);
    const rawStep = (max - min) / count;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    const multiplier = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
    const step = multiplier * magnitude;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const ticks: number[] = [];
    for (let value = niceMin; value <= niceMax + step / 2; value += step) {
        ticks.push(Number(value.toFixed(10)));
    }
    return { min: Number(niceMin.toFixed(10)), max: Number(niceMax.toFixed(10)), step, ticks };
}

/**
 * Coerces boolean-ish bindable values (true/false booleans, "true"/"false"
 * attribute strings, bare attribute "") to a boolean.
 */
export function toBool(value: unknown, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') {
        return value;
    }
    if (value == null) {
        return defaultValue;
    }
    const text = String(value).trim().toLowerCase();
    if (text === 'false') {
        return false;
    }
    if (text === 'true' || text === '') {
        return true;
    }
    return defaultValue;
}

/**
 * Formats a number for tick/value labels without float noise.
 */
export function formatNumber(value: number): string {
    if (!Number.isFinite(value)) {
        return '';
    }
    return String(Number(value.toFixed(2)));
}

/**
 * Shared, unregistered base class for the canvas chart components. Concrete
 * charts extend this and provide their own @customElement definition,
 * template, draw routine, legend items and accessible table data.
 *
 * Note on @bindable inheritance: Aurelia 2's Bindable.getAll walks the full
 * prototype chain when building a CustomElementDefinition, so the bindables
 * declared here are picked up by every subclass definition.
 */
export abstract class AuChartBase {
    @bindable public width: number = 600;
    @bindable public height: number = 400;
    @bindable public title: string = '';
    @bindable public legend: boolean = true;
    @bindable public animate: boolean = true;
    @bindable public palette?: string[];

    public canvasElement?: HTMLCanvasElement;
    protected readonly hostElement = resolve(HTMLElement);

    /** Set by data-shaped bindable change callbacks so the next render animates in. */
    protected animateNextRender = true;

    private isAttached = false;
    private renderQueued = false;
    private animationRaf: number | null = null;
    private animationTimeout: ReturnType<typeof setTimeout> | null = null;
    private resizeObserver?: ResizeObserver;
    private cachedPalette: string[] | null = null;
    private cachedFontFamily: string | null = null;

    /** Legend entries rendered as HTML below the canvas. */
    public abstract get legendItems(): ChartLegendItem[];
    /** Column headers for the visually-hidden data table. */
    public abstract get tableHeaders(): string[];
    /** Rows for the visually-hidden data table. */
    public abstract get tableRows(): (string | number)[][];
    /** Short textual summary of the data, used in the computed aria-label. */
    protected abstract getDataSummary(): string;
    /** Draws the chart. width/height are CSS pixels; progress is 0..1 (eased). */
    protected abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void;

    public get computedAriaLabel(): string {
        const parts = [this.title, this.getDataSummary()].filter(part => !!part && String(part).trim() !== '');
        return parts.join('. ') || 'Chart';
    }

    public get showLegend(): boolean {
        return toBool(this.legend, true) && this.legendItems.length > 0;
    }

    public attached(): void {
        this.isAttached = true;
        this.observeResize();
        this.animateNextRender = true;
        this.requestRender();
    }

    public detaching(): void {
        this.isAttached = false;
        if (this.resizeObserver != null) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }
        this.cancelAnimation();
        this.cachedPalette = null;
        this.cachedFontFamily = null;
    }

    public widthChanged(): void {
        this.requestRender();
    }

    public heightChanged(): void {
        this.requestRender();
    }

    public paletteChanged(): void {
        this.requestRender();
    }

    /**
     * Schedules a render on the next animation frame (setTimeout fallback for
     * non-browser environments). Multiple calls within a frame coalesce.
     */
    public requestRender(): void {
        if (this.renderQueued) {
            return;
        }
        this.renderQueued = true;
        const run = () => {
            this.renderQueued = false;
            this.performRender();
        };
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(run);
        } else {
            setTimeout(run, 16);
        }
    }

    protected get chartWidth(): number {
        const value = Number(this.width);
        return Number.isFinite(value) && value > 0 ? value : 600;
    }

    protected get chartHeight(): number {
        const value = Number(this.height);
        return Number.isFinite(value) && value > 0 ? value : 400;
    }

    /**
     * The active palette: bound override, else CSS custom properties, else hex
     * fallbacks. Pure getter (no caching writes) because it is evaluated inside
     * observed computed getters such as legendItems; the cache is populated by
     * performRender outside of observation.
     */
    protected get colors(): string[] {
        if (Array.isArray(this.palette) && this.palette.length > 0) {
            return this.palette;
        }
        return this.cachedPalette ?? this.resolvePalette();
    }

    protected colorAt(index: number): string {
        const colors = this.colors;
        return colors[((index % colors.length) + colors.length) % colors.length];
    }

    /** Resolves a single theme colour custom property with a hex fallback. */
    protected themeColor(property: string, fallback: string): string {
        const style = this.computedHostStyle();
        const value = style?.getPropertyValue(property).trim();
        return value || fallback;
    }

    protected get fontFamily(): string {
        return this.cachedFontFamily ?? this.themeColor('--font-family-base', 'system-ui, sans-serif');
    }

    protected font(size: number, weight = ''): string {
        return `${weight ? `${weight} ` : ''}${size}px ${this.fontFamily}`;
    }

    private computedHostStyle(): CSSStyleDeclaration | null {
        try {
            return typeof getComputedStyle === 'function' ? getComputedStyle(this.hostElement) : null;
        } catch {
            return null;
        }
    }

    private resolvePalette(): string[] {
        const style = this.computedHostStyle();
        const base = PALETTE_SOURCES.map(([property, fallback]) => {
            const value = style?.getPropertyValue(property).trim();
            return value || fallback;
        });
        const derived = [
            shadeColor(base[0], 0.45),
            shadeColor(base[1], 0.45),
            shadeColor(base[3], 0.45),
        ];
        return base.concat(derived);
    }

    private performRender(): void {
        const canvas = this.canvasElement;
        if (canvas == null || !this.isAttached) {
            return;
        }
        const ctx = this.getContext(canvas);
        if (ctx == null) {
            return;
        }
        // Populate style caches here, outside of computed-getter observation.
        if (this.cachedPalette == null) {
            this.cachedPalette = this.resolvePalette();
        }
        if (this.cachedFontFamily == null) {
            this.cachedFontFamily = this.themeColor('--font-family-base', 'system-ui, sans-serif');
        }
        const { width, height } = this.syncCanvasSize(canvas, ctx);
        this.cancelAnimation();
        const shouldAnimate = this.animateNextRender && this.shouldAnimate();
        this.animateNextRender = false;
        if (!shouldAnimate) {
            this.renderFrame(ctx, width, height, 1);
            return;
        }
        const start = Date.now();
        const step = () => {
            this.animationRaf = null;
            this.animationTimeout = null;
            const elapsed = Math.min(1, (Date.now() - start) / ANIMATION_DURATION);
            const progress = 1 - Math.pow(1 - elapsed, 3);
            this.renderFrame(ctx, width, height, progress);
            if (elapsed < 1) {
                if (typeof requestAnimationFrame === 'function') {
                    this.animationRaf = requestAnimationFrame(step);
                } else {
                    this.animationTimeout = setTimeout(step, 16);
                }
            }
        };
        step();
    }

    private renderFrame(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number): void {
        if (typeof ctx.clearRect === 'function') {
            ctx.clearRect(0, 0, width, height);
        }
        if (typeof ctx.save === 'function') {
            ctx.save();
        }
        this.draw(ctx, width, height, progress);
        if (typeof ctx.restore === 'function') {
            ctx.restore();
        }
    }

    private getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
        try {
            return canvas.getContext('2d');
        } catch {
            return null;
        }
    }

    private syncCanvasSize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): { width: number; height: number } {
        const cssWidth = canvas.clientWidth > 0 ? canvas.clientWidth : this.chartWidth;
        const cssHeight = Math.max(1, Math.round(cssWidth * (this.chartHeight / this.chartWidth)));
        const dpr = typeof devicePixelRatio === 'number' && Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
            ? devicePixelRatio
            : 1;
        const deviceWidth = Math.max(1, Math.round(cssWidth * dpr));
        const deviceHeight = Math.max(1, Math.round(cssHeight * dpr));
        if (canvas.width !== deviceWidth) {
            canvas.width = deviceWidth;
        }
        if (canvas.height !== deviceHeight) {
            canvas.height = deviceHeight;
        }
        canvas.style.height = `${cssHeight}px`;
        if (typeof ctx.setTransform === 'function') {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        if (typeof ctx.scale === 'function') {
            ctx.scale(dpr, dpr);
        }
        return { width: cssWidth, height: cssHeight };
    }

    private shouldAnimate(): boolean {
        if (!toBool(this.animate, true)) {
            return false;
        }
        if (typeof requestAnimationFrame !== 'function') {
            return false;
        }
        try {
            if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return false;
            }
        } catch {
            // matchMedia unavailable: animate anyway.
        }
        return true;
    }

    private cancelAnimation(): void {
        if (this.animationRaf != null && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this.animationRaf);
        }
        if (this.animationTimeout != null) {
            clearTimeout(this.animationTimeout);
        }
        this.animationRaf = null;
        this.animationTimeout = null;
    }

    private observeResize(): void {
        if (typeof ResizeObserver !== 'function' || this.canvasElement == null) {
            return;
        }
        this.resizeObserver = new ResizeObserver(() => {
            this.requestRender();
        });
        this.resizeObserver.observe(this.canvasElement);
    }
}
