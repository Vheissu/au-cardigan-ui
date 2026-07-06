import { AuCardCustomElement } from '../src/components/au-card';
import { AuButtonCustomElement } from '../src/components/au-button';

const meta = {
    title: 'Content/Card',
    component: AuCardCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-card
            style="max-width: 24rem;"
            variant.bind="variant"
            padding.bind="padding"
            interactive.bind="interactive"
            heading.bind="heading"
            subheading.bind="subheading"
            media-align.bind="mediaAlign">\${body}</au-card>`,
        props: args,
    }),
    args: {
        heading: 'Quarterly report',
        subheading: 'Finance · Q2 2026',
        body: 'Revenue grew 14% quarter over quarter, driven by the new self-serve plan and stronger retention in the APAC region.',
        variant: 'elevated',
        padding: 'comfortable',
        interactive: false,
        mediaAlign: 'top',
    },
    argTypes: {
        heading: { control: 'text' },
        subheading: { control: 'text' },
        body: { control: 'text' },
        variant: { control: 'select', options: ['elevated', 'outlined', 'subtle'] },
        padding: { control: 'select', options: ['none', 'compact', 'comfortable', 'spacious'] },
        interactive: { control: 'boolean' },
        mediaAlign: { control: 'select', options: ['top', 'start', 'end'] },
    },
};

export default meta;

export const Playground = {};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start;">
                <au-card variant="elevated" heading="Elevated" style="width: 16rem;">Casts a shadow to lift content off the page.</au-card>
                <au-card variant="outlined" heading="Outlined" style="width: 16rem;">Uses a border instead of a shadow for flat layouts.</au-card>
                <au-card variant="subtle" heading="Subtle" style="width: 16rem;">A tinted surface for secondary content.</au-card>
            </div>`,
    }),
};

export const WithMedia = {
    render: () => ({
        template: `
            <au-card variant="elevated" heading="Cape Byron walking track" subheading="3.7 km loop · Easy" style="max-width: 24rem;">
                <img slot="media" src="https://picsum.photos/seed/cardigan-card/640/360" alt="Coastal headland at sunrise" style="display: block; width: 100%;">
                Follow the boardwalk from the beach through rainforest to the most easterly point of mainland Australia.
            </au-card>`,
    }),
};

export const WithFooter = {
    render: () => ({
        template: `
            <au-card variant="outlined" heading="Delete workspace" subheading="This action cannot be undone" style="max-width: 24rem;">
                Deleting the Acme workspace removes all projects, members and billing history after a 30 day grace period.
                <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <au-button variant="ghost" color="dark" size="small">Cancel</au-button>
                    <au-button color="error" size="small">Delete workspace</au-button>
                </div>
            </au-card>`,
        components: [AuButtonCustomElement],
    }),
};

export const Interactive = {
    render: () => ({
        template: `
            <au-card variant="elevated" interactive.bind="true" heading="Open project" subheading="cardigan-ui" style="max-width: 20rem;">
                Focusable and clickable — useful for card-as-link layouts.
            </au-card>`,
    }),
};
