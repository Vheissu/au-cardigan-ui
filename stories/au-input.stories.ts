import { AuInputCustomElement } from '../src/components/au-input';

const meta = {
    title: 'Forms/Input',
    component: AuInputCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-input
            label.bind="label"
            type.bind="type"
            value.bind="value"
            placeholder.bind="placeholder"
            helper.bind="helper"
            error.bind="error"
            size.bind="size"
            disabled.bind="disabled"
            readonly.bind="readonly"
            required.bind="required"></au-input>`,
        props: args,
    }),
    args: {
        label: 'Email address',
        type: 'email',
        value: '',
        placeholder: 'you@example.com',
        helper: 'We will never share your email.',
        error: '',
        size: 'medium',
        disabled: false,
        readonly: false,
        required: false,
    },
    argTypes: {
        label: { control: 'text' },
        type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'] },
        value: { control: 'text' },
        placeholder: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-input label="Small" size="small" placeholder="Small input"></au-input>
                <au-input label="Medium" size="medium" placeholder="Medium input"></au-input>
                <au-input label="Large" size="large" placeholder="Large input"></au-input>
            </div>`,
    }),
};

export const Validation = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-input label="Username" value="dwayne" helper="Letters and numbers only."></au-input>
                <au-input label="Email address" value="not-an-email" error="Enter a valid email address." required></au-input>
            </div>`,
    }),
};

export const WithAffixes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-input label="Price" type="number" placeholder="0.00">
                    <span slot="prefix">$</span>
                </au-input>
                <au-input label="Website" placeholder="mysite">
                    <span slot="suffix">.com.au</span>
                </au-input>
            </div>`,
    }),
};

export const DisabledAndReadonly = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <au-input label="Account ID" value="ACC-20419" readonly helper="This value cannot be edited."></au-input>
                <au-input label="Legacy reference" value="REF-88" disabled></au-input>
            </div>`,
    }),
};
