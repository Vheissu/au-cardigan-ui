import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-animation.css';
import template from './au-animation.html';

export const AnimationPresets: Record<string, Keyframe[]> = {
    'fade-in': [
        { opacity: 0 },
        { opacity: 1 }
    ],
    'fade-out': [
        { opacity: 1 },
        { opacity: 0 }
    ],
    'slide-in-up': [
        { transform: 'translateY(1.5rem)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ],
    'slide-in-down': [
        { transform: 'translateY(-1.5rem)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ],
    'slide-in-left': [
        { transform: 'translateX(-1.5rem)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
    ],
    'slide-in-right': [
        { transform: 'translateX(1.5rem)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
    ],
    'slide-out-up': [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-1.5rem)', opacity: 0 }
    ],
    'slide-out-down': [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(1.5rem)', opacity: 0 }
    ],
    'zoom-in': [
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
    ],
    'zoom-out': [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.8)', opacity: 0 }
    ],
    'bounce': [
        { transform: 'translateY(0)', offset: 0 },
        { transform: 'translateY(-1.25rem)', offset: 0.3 },
        { transform: 'translateY(0)', offset: 0.5 },
        { transform: 'translateY(-0.6rem)', offset: 0.7 },
        { transform: 'translateY(0)', offset: 0.85 },
        { transform: 'translateY(0)', offset: 1 }
    ],
    'shake': [
        { transform: 'translateX(0)', offset: 0 },
        { transform: 'translateX(-0.5rem)', offset: 0.15 },
        { transform: 'translateX(0.5rem)', offset: 0.3 },
        { transform: 'translateX(-0.5rem)', offset: 0.45 },
        { transform: 'translateX(0.5rem)', offset: 0.6 },
        { transform: 'translateX(-0.25rem)', offset: 0.75 },
        { transform: 'translateX(0)', offset: 1 }
    ],
    'pulse': [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.05)', offset: 0.5 },
        { transform: 'scale(1)', offset: 1 }
    ],
    'flip-x': [
        { transform: 'perspective(25rem) rotateX(0deg)' },
        { transform: 'perspective(25rem) rotateX(360deg)' }
    ],
    'flip-y': [
        { transform: 'perspective(25rem) rotateY(0deg)' },
        { transform: 'perspective(25rem) rotateY(360deg)' }
    ],
    'rotate-in': [
        { transform: 'rotate(-200deg)', opacity: 0 },
        { transform: 'rotate(0)', opacity: 1 }
    ],
    'wobble': [
        { transform: 'translateX(0) rotate(0deg)', offset: 0 },
        { transform: 'translateX(-1.25rem) rotate(-5deg)', offset: 0.15 },
        { transform: 'translateX(1rem) rotate(3deg)', offset: 0.3 },
        { transform: 'translateX(-0.75rem) rotate(-3deg)', offset: 0.45 },
        { transform: 'translateX(0.5rem) rotate(2deg)', offset: 0.6 },
        { transform: 'translateX(-0.25rem) rotate(-1deg)', offset: 0.75 },
        { transform: 'translateX(0) rotate(0deg)', offset: 1 }
    ],
    'heartbeat': [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.3)', offset: 0.14 },
        { transform: 'scale(1)', offset: 0.28 },
        { transform: 'scale(1.3)', offset: 0.42 },
        { transform: 'scale(1)', offset: 0.7 },
        { transform: 'scale(1)', offset: 1 }
    ]
};

@customElement({
    name: 'au-animation',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuAnimationCustomElement implements ICustomElementViewModel {
    @bindable public preset: string = '';
    @bindable public duration: number | string = 600;
    @bindable public delay: number | string = 0;
    @bindable public easing: string = 'ease';
    @bindable public iterations: number | string = 1;
    @bindable public direction: PlaybackDirection = 'normal';
    @bindable public fill: FillMode = 'both';
    @bindable public autoplay: boolean = true;
    @bindable public keyframes: Keyframe[] | null = null;
    @bindable({ mode: BindingMode.twoWay }) public playing: boolean = false;

    private targetElement?: HTMLElement;
    private animation: Animation | null = null;
    private readonly hostElement = resolve(HTMLElement);
    private isAttached = false;
    private syncingPlaying = false;

    public attached() {
        this.isAttached = true;
        if (this.autoplay || this.playing) {
            this.play();
        }
    }

    public detaching() {
        this.isAttached = false;
        this.teardownAnimation();
    }

    public playingChanged(newValue: boolean) {
        if (this.syncingPlaying || !this.isAttached) {
            return;
        }
        if (newValue) {
            this.play();
        } else {
            this.pause();
        }
    }

    public play() {
        if (this.animation) {
            this.animation.play();
            this.setPlaying(true);
            return;
        }
        this.startAnimation();
    }

    public pause() {
        if (this.animation) {
            this.animation.pause();
        }
        this.setPlaying(false);
    }

    public restart() {
        this.teardownAnimation();
        this.startAnimation();
    }

    public cancel() {
        this.teardownAnimation();
        this.setPlaying(false);
    }

    public resolveKeyframes(): Keyframe[] {
        if (Array.isArray(this.keyframes) && this.keyframes.length) {
            return this.keyframes;
        }
        return AnimationPresets[this.preset] ?? [];
    }

    private startAnimation() {
        const target = this.targetElement;
        const frames = this.resolveKeyframes();
        if (!target || !frames.length || typeof target.animate !== 'function') {
            // Web Animations API unavailable (e.g. jsdom) or nothing to animate - no-op safely.
            return;
        }
        this.animation = target.animate(frames, this.buildTiming());
        this.animation.onfinish = () => {
            this.setPlaying(false);
            this.dispatch('animation-finish');
        };
        this.setPlaying(true);
        this.dispatch('animation-start');
    }

    private buildTiming(): KeyframeAnimationOptions {
        const iterations = this.iterations === 'infinite'
            ? Infinity
            : (Number(this.iterations) || 1);
        return {
            duration: Number(this.duration) || 0,
            delay: Number(this.delay) || 0,
            easing: this.easing || 'ease',
            iterations,
            direction: this.direction,
            fill: this.fill
        };
    }

    private teardownAnimation() {
        if (!this.animation) {
            return;
        }
        this.animation.onfinish = null;
        try {
            this.animation.cancel();
        } catch {
            // Ignore cancellation errors from partially implemented Animation objects.
        }
        this.animation = null;
    }

    private setPlaying(value: boolean) {
        if (this.playing === value) {
            return;
        }
        this.syncingPlaying = true;
        this.playing = value;
        this.syncingPlaying = false;
    }

    private dispatch(name: string) {
        this.hostElement.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            composed: true
        }));
    }
}
