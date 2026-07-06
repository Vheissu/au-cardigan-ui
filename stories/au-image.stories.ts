import { AuImageCustomElement } from '../src/components/au-image';

const meta = {
    title: 'Content/Image',
    component: AuImageCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 600px;">
            <au-image
                src.bind="src"
                alt.bind="alt"
                fit.bind="fit"
                color.bind="color"
                natural-width.bind="naturalWidth"
                natural-height.bind="naturalHeight"
                loading.bind="loading"></au-image>
        </div>`,
        props: args,
    }),
    args: {
        src: 'https://picsum.photos/seed/cardigan/600/400',
        alt: 'Landscape photograph',
        fit: 'none',
        color: 'transparent',
        naturalWidth: '600',
        naturalHeight: '400',
        loading: 'auto',
    },
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
        fit: { control: 'select', options: ['none', 'cover', 'contain'] },
        color: { control: 'color' },
        naturalWidth: { control: 'text' },
        naturalHeight: { control: 'text' },
        loading: { control: 'select', options: ['auto', 'lazy', 'eager'] },
    },
};

export default meta;

export const Playground = {};

export const Default = {
    render: () => ({
        template: `
            <div style="max-width: 480px;">
                <au-image src="https://picsum.photos/seed/harbour/480/320" alt="Harbour at dusk"></au-image>
            </div>`,
    }),
};

export const CoverFit = {
    render: () => ({
        template: `
            <div style="max-width: 480px;">
                <au-image
                    fit="cover"
                    src="https://picsum.photos/seed/mountains/800/500"
                    alt="Mountain range under cloud"
                    natural-width="800"
                    natural-height="500"></au-image>
            </div>`,
    }),
};

export const ContainWithBackground = {
    render: () => ({
        template: `
            <div style="max-width: 480px;">
                <au-image
                    fit="contain"
                    color="#1f2933"
                    src="https://picsum.photos/seed/forest/400/600"
                    alt="Forest path in portrait orientation"
                    natural-width="800"
                    natural-height="500"></au-image>
            </div>`,
    }),
};
