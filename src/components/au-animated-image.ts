import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-animated-image.css';
import template from './au-animated-image.html';

@customElement({
    name: 'au-animated-image',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuAnimatedImageCustomElement implements ICustomElementViewModel {
    @bindable public src: string = '';
    @bindable public alt: string = '';
    @bindable public autoplay: boolean = true;
    @bindable({ mode: BindingMode.twoWay }) public playing: boolean = true;
    @bindable public controls: boolean = true;
    @bindable public width: string | number | null = null;
    @bindable public height: string | number | null = null;

    private imgElement?: HTMLImageElement;
    private canvasElement?: HTMLCanvasElement;
    private readonly hostElement = resolve(HTMLElement);
    private isAttached = false;
    private userOverride = false;

    public binding() {
        if (!this.autoplay && this.playing) {
            this.playing = false;
        }
    }

    public attached() {
        if (this.playing && !this.userOverride && this.prefersReducedMotion()) {
            this.playing = false;
        }
        this.isAttached = true;
        this.applyPlayingState();
    }

    public detaching() {
        this.isAttached = false;
    }

    public playingChanged() {
        if (!this.isAttached) {
            return;
        }
        this.applyPlayingState();
        this.hostElement.dispatchEvent(new CustomEvent(this.playing ? 'play' : 'pause', {
            bubbles: true,
            composed: true
        }));
    }

    public srcChanged() {
        if (this.isAttached && !this.playing) {
            this.freezeFrame();
        }
    }

    public toggle() {
        this.userOverride = true;
        this.playing = !this.playing;
    }

    private applyPlayingState() {
        if (!this.playing) {
            this.freezeFrame();
        }
    }

    private freezeFrame() {
        const img = this.imgElement;
        const canvas = this.canvasElement;
        if (!img || !canvas) {
            return;
        }
        const width = img.clientWidth || img.naturalWidth || 0;
        const height = img.clientHeight || img.naturalHeight || 0;
        if (width <= 0 || height <= 0) {
            return;
        }
        const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        let context: CanvasRenderingContext2D | null = null;
        try {
            context = canvas.getContext('2d');
        } catch {
            context = null;
        }
        if (!context) {
            // No 2d context available (e.g. jsdom) - state still toggles without drawing.
            return;
        }
        try {
            context.scale(dpr, dpr);
            context.drawImage(img, 0, 0, width, height);
        } catch {
            // Image not decodable yet - keep the paused state without a frozen frame.
        }
    }

    private prefersReducedMotion(): boolean {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return false;
        }
        try {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch {
            return false;
        }
    }
}
