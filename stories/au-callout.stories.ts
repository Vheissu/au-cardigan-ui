import { AuCalloutCustomElement } from '../src/components/au-callout';

const variants = ['info', 'success', 'warning', 'error', 'neutral'];

const meta = {
    title: 'Feedback/Callout',
    component: AuCalloutCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 32rem;">
            <au-callout
                variant.bind="variant"
                heading.bind="heading"
                dismissible.bind="dismissible">\${body}</au-callout>
        </div>`,
        props: args,
    }),
    args: {
        variant: 'info',
        heading: 'Scheduled maintenance',
        body: 'The API will be read-only on Saturday between 02:00 and 04:00 UTC while we upgrade the database cluster.',
        dismissible: false,
    },
    argTypes: {
        variant: { control: 'select', options: variants },
        heading: { control: 'text' },
        body: { control: 'text' },
        dismissible: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 32rem;">
                ${variants.map(variant => `<au-callout variant="${variant}" heading="${variant.charAt(0).toUpperCase() + variant.slice(1)} callout">Use the ${variant} variant to match the tone of the message.</au-callout>`).join('\n')}
            </div>`,
    }),
};

export const WithIcon = {
    render: () => ({
        template: `
            <div style="max-width: 32rem;">
                <au-callout variant="warning" heading="Storage almost full">
                    <span slot="icon" aria-hidden="true" style="font-size: 1.25rem;">⚠️</span>
                    You have used 9.2 GB of your 10 GB plan. Upgrade or remove old attachments to keep receiving files.
                </au-callout>
            </div>`,
    }),
};

export const Dismissible = {
    render: () => ({
        template: `
            <div style="max-width: 32rem;">
                <au-callout variant="success" heading="Import finished" dismissible.bind="true">
                    All 312 contacts were imported. Duplicates were merged automatically.
                </au-callout>
            </div>`,
    }),
};
