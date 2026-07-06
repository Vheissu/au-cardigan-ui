import { AuCopyButtonCustomElement } from '../src/components/au-copy-button';

const meta = {
    title: 'Forms/Copy Button',
    component: AuCopyButtonCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-copy-button
            value.bind="value"
            label.bind="label"
            copied-label.bind="copiedLabel"
            reset-delay.bind="resetDelay"
            disabled.bind="disabled"></au-copy-button>`,
        props: args,
    }),
    args: {
        value: 'npm install @aurelia/cardigan',
        label: 'Copy',
        copiedLabel: 'Copied!',
        resetDelay: 2000,
        disabled: false,
    },
    argTypes: {
        value: { control: 'text' },
        label: { control: 'text' },
        copiedLabel: { control: 'text' },
        resetDelay: { control: { type: 'number', min: 0, step: 500 } },
        disabled: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const CopyFromTarget = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <code id="api-key-snippet" style="padding: 0.5rem 0.75rem; background: rgba(127, 127, 127, 0.15); border-radius: 4px;">sk_live_9f2c41d7b8a3</code>
                <au-copy-button for="#api-key-snippet" label="Copy key"></au-copy-button>
            </div>`,
    }),
};

export const CustomLabels = {
    args: {
        value: 'https://cardigan.dev/docs/getting-started',
        label: 'Copy link',
        copiedLabel: 'Link copied',
        resetDelay: 3000,
    },
};

export const Disabled = {
    args: {
        value: '',
        label: 'Copy token',
        disabled: true,
    },
};
