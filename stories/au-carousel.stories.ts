import { AuCarouselCustomElement } from '../src/components/au-carousel';
import { AuCarouselItemCustomElement } from '../src/components/au-carousel-item';

const imageSlide = (seed: string, label: string) => `
                <au-carousel-item label="${label}">
                    <img src="https://picsum.photos/seed/${seed}/960/420" alt="${label}" style="display: block; width: 100%; height: 100%; object-fit: cover;" />
                </au-carousel-item>`;

const meta = {
    title: 'Media/Carousel',
    component: AuCarouselCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 60rem;">
            <au-carousel
                active-index.bind="activeIndex"
                autoplay.bind="autoplay"
                interval.bind="interval"
                loop.bind="loop"
                controls.bind="controls"
                indicators.bind="indicators">
                ${imageSlide('alps', 'Morning light over the Alps')}
                ${imageSlide('harbour', 'Fishing boats in the harbour')}
                ${imageSlide('forest', 'Fog rolling through the forest')}
                ${imageSlide('desert', 'Dunes at golden hour')}
            </au-carousel>
        </div>`,
        components: [AuCarouselItemCustomElement],
        props: args,
    }),
    args: {
        activeIndex: 0,
        autoplay: false,
        interval: 5000,
        loop: true,
        controls: true,
        indicators: true,
    },
    argTypes: {
        activeIndex: { control: { type: 'number', min: 0, max: 3, step: 1 } },
        autoplay: { control: 'boolean' },
        interval: { control: { type: 'number', min: 1000, step: 500 } },
        loop: { control: 'boolean' },
        controls: { control: 'boolean' },
        indicators: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const ImageGallery = {
    render: () => ({
        template: `
            <div style="max-width: 48rem;">
                <au-carousel>
                    ${imageSlide('lighthouse', 'Lighthouse at dusk')}
                    ${imageSlide('vineyard', 'Vineyard rows in autumn')}
                    ${imageSlide('glacier', 'Glacier meltwater lake')}
                </au-carousel>
            </div>`,
        components: [AuCarouselItemCustomElement],
    }),
};

export const ContentSlides = {
    render: () => ({
        template: `
            <div style="max-width: 40rem;">
                <au-carousel loop.bind="false">
                    <au-carousel-item label="Step 1 of 3">
                        <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; height: 14rem; padding: 2rem; background: #0f172a; color: #f8fafc;">
                            <strong style="font-size: 1.25rem;">1. Create a workspace</strong>
                            <span>Pick a name and invite your first teammates.</span>
                        </div>
                    </au-carousel-item>
                    <au-carousel-item label="Step 2 of 3">
                        <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; height: 14rem; padding: 2rem; background: #14532d; color: #f0fdf4;">
                            <strong style="font-size: 1.25rem;">2. Connect your repository</strong>
                            <span>Link GitHub so deployments trigger automatically.</span>
                        </div>
                    </au-carousel-item>
                    <au-carousel-item label="Step 3 of 3">
                        <div style="display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; height: 14rem; padding: 2rem; background: #7c2d12; color: #fff7ed;">
                            <strong style="font-size: 1.25rem;">3. Ship it</strong>
                            <span>Push to main and watch the first build go live.</span>
                        </div>
                    </au-carousel-item>
                </au-carousel>
                <p style="margin-top: 0.75rem; font-size: 0.85em; opacity: 0.7;">
                    With <code>loop</code> off, the previous/next controls clamp at the first and last slide.
                </p>
            </div>`,
        components: [AuCarouselItemCustomElement],
    }),
};

export const MinimalNoChrome = {
    render: () => ({
        template: `
            <div style="max-width: 48rem;">
                <au-carousel controls.bind="false" indicators.bind="true">
                    ${imageSlide('coast', 'Cliffs along the coast')}
                    ${imageSlide('meadow', 'Wildflower meadow')}
                    ${imageSlide('canyon', 'River canyon from above')}
                </au-carousel>
                <p style="margin-top: 0.75rem; font-size: 0.85em; opacity: 0.7;">
                    Controls hidden; navigate with the indicator dots or the arrow keys while the carousel is focused.
                </p>
            </div>`,
        components: [AuCarouselItemCustomElement],
    }),
};

export const Autoplay = {
    render: () => ({
        template: `
            <div style="max-width: 48rem;">
                <au-carousel autoplay.bind="true" interval="2500">
                    ${imageSlide('aurora', 'Aurora over the fjord')}
                    ${imageSlide('market', 'Night market stalls')}
                    ${imageSlide('temple', 'Temple in the rain')}
                </au-carousel>
                <p style="margin-top: 0.75rem; font-size: 0.85em; opacity: 0.7;">
                    Autoplay advances every 2.5s, pauses on hover/focus, and is skipped entirely when the user prefers reduced motion.
                </p>
            </div>`,
        components: [AuCarouselItemCustomElement],
    }),
};
