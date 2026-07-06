import { AuSwitchCustomElement } from '../src/components/au-switch';

const meta = {
    title: 'Forms/Switch',
    component: AuSwitchCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-switch
            label.bind="label"
            description.bind="description"
            helper.bind="helper"
            error.bind="error"
            checked.bind="checked"
            size.bind="size"
            disabled.bind="disabled"
            required.bind="required"></au-switch>`,
        props: args,
    }),
    args: {
        label: 'Dark mode',
        description: 'Use a darker colour palette after sunset.',
        helper: '',
        error: '',
        checked: false,
        size: 'medium',
        disabled: false,
        required: false,
    },
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        checked: { control: 'boolean' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-switch label="Small" size="small" checked.bind="true"></au-switch>
                <au-switch label="Medium" size="medium" checked.bind="true"></au-switch>
                <au-switch label="Large" size="large" checked.bind="true"></au-switch>
            </div>`,
    }),
};

export const WithDescription = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-switch
                    label="Auto-renew subscription"
                    description="Your card will be charged on the 1st of each month."
                    checked.bind="true"></au-switch>
            </div>`,
    }),
};

export const Disabled = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-switch label="Maintenance mode" disabled.bind="true"></au-switch>
                <au-switch label="Beta features" checked.bind="true" disabled.bind="true" helper="Managed by your workspace admin."></au-switch>
            </div>`,
    }),
};

export const WithError = {
    args: {
        label: 'Accept data processing',
        description: '',
        error: 'This setting is required to use the service.',
        required: true,
    },
};
