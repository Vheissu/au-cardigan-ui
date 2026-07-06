import { AnimationPresets, AuAnimationCustomElement } from '../src/components/au-animation';

const presets = Object.keys(AnimationPresets);

const box = (label: string, background: string) => `
                    <div style="display: flex; align-items: center; justify-content: center; width: 8rem; height: 5rem; border-radius: 0.5rem; background: ${background}; color: #fff; font-weight: 600; font-size: 0.85rem;">${label}</div>`;

const meta = {
    title: 'Media/Animation',
    component: AuAnimationCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
            <au-animation
                component.ref="anim"
                preset.bind="preset"
                duration.bind="duration"
                delay.bind="delay"
                easing.bind="easing"
                iterations.bind="iterations"
                direction.bind="direction"
                fill.bind="fill"
                autoplay.bind="autoplay">
                ${box('Animate me', '#1d4ed8')}
            </au-animation>
            <button type="button" click.trigger="anim.restart()">Replay</button>
        </div>`,
        props: args,
    }),
    args: {
        preset: 'slide-in-up',
        duration: 600,
        delay: 0,
        easing: 'ease',
        iterations: 1,
        direction: 'normal',
        fill: 'both',
        autoplay: true,
    },
    argTypes: {
        preset: { control: 'select', options: presets },
        duration: { control: { type: 'number', min: 0, step: 100 } },
        delay: { control: { type: 'number', min: 0, step: 100 } },
        easing: {
            control: 'select',
            options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'cubic-bezier(0.34, 1.56, 0.64, 1)'],
        },
        iterations: { control: { type: 'number', min: 1, step: 1 } },
        direction: { control: 'select', options: ['normal', 'reverse', 'alternate', 'alternate-reverse'] },
        fill: { control: 'select', options: ['both', 'forwards', 'backwards', 'none', 'auto'] },
        autoplay: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const EntrancePresets = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <au-animation preset="fade-in" duration="700">
                    ${box('fade-in', '#1d4ed8')}
                </au-animation>
                <au-animation preset="slide-in-up" duration="700" delay="150">
                    ${box('slide-in-up', '#0f766e')}
                </au-animation>
                <au-animation preset="slide-in-right" duration="700" delay="300">
                    ${box('slide-in-right', '#7c2d12')}
                </au-animation>
                <au-animation preset="zoom-in" duration="700" delay="450">
                    ${box('zoom-in', '#6d28d9')}
                </au-animation>
                <au-animation preset="rotate-in" duration="700" delay="600">
                    ${box('rotate-in', '#be123c')}
                </au-animation>
            </div>`,
    }),
};

export const AttentionSeekers = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <au-animation component.ref="bounceAnim" preset="bounce" duration="900" autoplay.bind="false">
                        ${box('bounce', '#1d4ed8')}
                    </au-animation>
                    <au-animation component.ref="shakeAnim" preset="shake" duration="700" autoplay.bind="false">
                        ${box('shake', '#b91c1c')}
                    </au-animation>
                    <au-animation component.ref="pulseAnim" preset="pulse" duration="700" autoplay.bind="false">
                        ${box('pulse', '#0f766e')}
                    </au-animation>
                    <au-animation component.ref="wobbleAnim" preset="wobble" duration="900" autoplay.bind="false">
                        ${box('wobble', '#a16207')}
                    </au-animation>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" click.trigger="bounceAnim.restart()">Bounce</button>
                    <button type="button" click.trigger="shakeAnim.restart()">Shake</button>
                    <button type="button" click.trigger="pulseAnim.restart()">Pulse</button>
                    <button type="button" click.trigger="wobbleAnim.restart()">Wobble</button>
                </div>
            </div>`,
    }),
};

export const CustomKeyframes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
                <au-animation
                    component.ref="anim"
                    keyframes.bind="sweepFrames"
                    duration="900"
                    easing="cubic-bezier(0.34, 1.56, 0.64, 1)">
                    ${box('custom', '#334155')}
                </au-animation>
                <button type="button" click.trigger="anim.restart()">Replay custom sweep</button>
                <p style="font-size: 0.85em; opacity: 0.7; max-width: 32rem;">
                    Passes a <code>keyframes</code> array directly instead of a named preset.
                </p>
            </div>`,
        props: {
            sweepFrames: [
                { transform: 'translateX(-4rem) rotate(-8deg)', opacity: 0 },
                { transform: 'translateX(0.5rem) rotate(2deg)', opacity: 1, offset: 0.7 },
                { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
            ],
        },
    }),
};
