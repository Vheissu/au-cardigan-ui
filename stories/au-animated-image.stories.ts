import { AuAnimatedImageCustomElement } from '../src/components/au-animated-image';

const earthGif = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif';

const meta = {
    title: 'Media/Animated Image',
    component: AuAnimatedImageCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-animated-image
            src.bind="src"
            alt.bind="alt"
            autoplay.bind="autoplay"
            controls.bind="controls"
            width.bind="width"
            height.bind="height"></au-animated-image>`,
        props: args,
    }),
    args: {
        src: earthGif,
        alt: 'Rotating globe showing the continents',
        autoplay: true,
        controls: true,
        width: 240,
        height: 240,
    },
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
        autoplay: { control: 'boolean' },
        controls: { control: 'boolean' },
        width: { control: 'number' },
        height: { control: 'number' },
    },
};

export default meta;

export const Playground = {};

export const StartPaused = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
                <au-animated-image
                    src="${earthGif}"
                    alt="Rotating globe showing the continents"
                    autoplay.bind="false"
                    width="240"
                    height="240"></au-animated-image>
                <p style="font-size: 0.85em; opacity: 0.7; max-width: 32rem;">
                    With <code>autoplay</code> off the GIF loads paused on a frozen frame; the overlay button starts playback.
                    Playback also starts paused for users who prefer reduced motion.
                </p>
            </div>`,
    }),
};

export const WithoutControls = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
                <au-animated-image
                    src="${earthGif}"
                    alt="Rotating globe showing the continents"
                    controls.bind="false"
                    width="200"
                    height="200"></au-animated-image>
                <p style="font-size: 0.85em; opacity: 0.7; max-width: 32rem;">
                    No play/pause overlay. Pair with the two-way <code>playing</code> bindable if you need external control.
                </p>
            </div>`,
    }),
};

export const ExternalToggle = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start;">
                <au-animated-image
                    src="${earthGif}"
                    alt="Rotating globe showing the continents"
                    controls.bind="false"
                    playing.bind="isPlaying"
                    width="220"
                    height="220"></au-animated-image>
                <button type="button" click.trigger="isPlaying = !isPlaying">
                    \${isPlaying ? 'Pause' : 'Play'} animation
                </button>
            </div>`,
        props: { isPlaying: true },
    }),
};
