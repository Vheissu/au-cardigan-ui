import '../polyfills';
import { BindingMode, bindable, children, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-carousel.css';
import template from './au-carousel.html';
import { AuCarouselItemCustomElement } from './au-carousel-item';

@customElement({
    name: 'au-carousel',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCarouselCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) public activeIndex: number = 0;
    @bindable public autoplay: boolean = false;
    @bindable public interval: number | string = 5000;
    @bindable public loop: boolean = true;
    @bindable public controls: boolean = true;
    @bindable public indicators: boolean = true;

    @children('au-carousel-item')
    public items: AuCarouselItemCustomElement[] = [];

    private readonly hostElement = resolve(HTMLElement);
    private timerId: ReturnType<typeof setInterval> | null = null;
    private isAttached = false;

    public get slideCount() {
        return this.items?.length ?? 0;
    }

    public get trackStyle() {
        return `transform: translateX(-${(Number(this.activeIndex) || 0) * 100}%)`;
    }

    public attached() {
        this.isAttached = true;
        this.syncItems();
        this.startAutoplay();
    }

    public detaching() {
        this.isAttached = false;
        this.stopAutoplay();
    }

    public itemsChanged() {
        this.clampActiveIndex();
        this.syncItems();
    }

    public activeIndexChanged(newValue: number | string, oldValue: number | string) {
        const numeric = Number(newValue) || 0;
        if (numeric !== newValue) {
            this.activeIndex = numeric;
            return;
        }
        this.syncItems();
        if (this.isAttached && numeric !== (Number(oldValue) || 0)) {
            this.hostElement.dispatchEvent(new CustomEvent('slide-change', {
                detail: { index: numeric },
                bubbles: true,
                composed: true
            }));
        }
    }

    public next() {
        this.goTo((Number(this.activeIndex) || 0) + 1);
    }

    public previous() {
        this.goTo((Number(this.activeIndex) || 0) - 1);
    }

    public goTo(index: number) {
        const count = this.slideCount;
        if (count === 0) {
            return;
        }
        let target = Number(index) || 0;
        if (this.loop) {
            target = ((target % count) + count) % count;
        } else {
            target = Math.min(Math.max(target, 0), count - 1);
        }
        if (target === (Number(this.activeIndex) || 0)) {
            return;
        }
        this.activeIndex = target;
    }

    public handleKeydown(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.previous();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.next();
        }
    }

    public handleMouseEnter() {
        this.stopAutoplay();
    }

    public handleMouseLeave() {
        this.startAutoplay();
    }

    public handleFocusIn() {
        this.stopAutoplay();
    }

    public handleFocusOut() {
        this.startAutoplay();
    }

    private syncItems() {
        const items = this.items ?? [];
        const active = Number(this.activeIndex) || 0;
        items.forEach((item, index) => {
            item.applyState(index, items.length, index === active);
        });
    }

    private clampActiveIndex() {
        const count = this.slideCount;
        const active = Number(this.activeIndex) || 0;
        if (count > 0 && active > count - 1) {
            this.activeIndex = count - 1;
        }
    }

    private startAutoplay() {
        if (!this.isAttached || !this.autoplay || this.timerId != null || this.prefersReducedMotion()) {
            return;
        }
        const ms = Number(this.interval) || 5000;
        this.timerId = setInterval(() => this.next(), ms);
    }

    private stopAutoplay() {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.timerId = null;
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
