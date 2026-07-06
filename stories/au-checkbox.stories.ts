import { AuCheckboxCustomElement } from '../src/components/au-checkbox';

const meta = {
    title: 'Forms/Checkbox',
    component: AuCheckboxCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-checkbox
            label.bind="label"
            description.bind="description"
            helper.bind="helper"
            error.bind="error"
            checked.bind="checked"
            indeterminate.bind="indeterminate"
            disabled.bind="disabled"
            required.bind="required"></au-checkbox>`,
        props: args,
    }),
    args: {
        label: 'Subscribe to the newsletter',
        description: 'One email a month, no spam.',
        helper: '',
        error: '',
        checked: false,
        indeterminate: false,
        disabled: false,
        required: false,
    },
    argTypes: {
        label: { control: 'text' },
        description: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        checked: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const States = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-checkbox label="Unchecked"></au-checkbox>
                <au-checkbox label="Checked" checked.bind="true"></au-checkbox>
                <au-checkbox label="Indeterminate" indeterminate.bind="true"></au-checkbox>
                <au-checkbox label="Disabled" disabled.bind="true"></au-checkbox>
                <au-checkbox label="Disabled and checked" checked.bind="true" disabled.bind="true"></au-checkbox>
            </div>`,
    }),
};

export const WithDescription = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-checkbox
                    label="Enable two-factor authentication"
                    description="You will be asked for a code from your authenticator app each time you sign in."
                    checked.bind="true"></au-checkbox>
            </div>`,
    }),
};

export const WithError = {
    args: {
        label: 'I agree to the terms and conditions',
        description: '',
        error: 'You must accept the terms to continue.',
        required: true,
    },
};
