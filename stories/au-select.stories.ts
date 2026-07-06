import { AuSelectCustomElement } from '../src/components/au-select';

const stateOptions = [
    { value: 'nsw', label: 'New South Wales' },
    { value: 'vic', label: 'Victoria' },
    { value: 'qld', label: 'Queensland' },
    { value: 'wa', label: 'Western Australia' },
    { value: 'sa', label: 'South Australia' },
    { value: 'tas', label: 'Tasmania' },
];

const meta = {
    title: 'Forms/Select',
    component: AuSelectCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-select
            value.bind="value"
            options.bind="options"
            placeholder.bind="placeholder"
            size.bind="size"
            disabled.bind="disabled"
            required.bind="required"
            multiple.bind="multiple"></au-select>`,
        props: args,
    }),
    args: {
        value: '',
        options: stateOptions,
        placeholder: 'Select a state',
        size: 'medium',
        disabled: false,
        required: false,
        multiple: false,
    },
    argTypes: {
        value: { control: 'text' },
        options: { control: 'object' },
        placeholder: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        multiple: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 20rem;">
                <au-select size="small" placeholder="Small" options.bind="options"></au-select>
                <au-select size="medium" placeholder="Medium" options.bind="options"></au-select>
                <au-select size="large" placeholder="Large" options.bind="options"></au-select>
            </div>`,
        props: { options: stateOptions },
    }),
};

export const SlottedOptions = {
    render: () => ({
        template: `
            <div style="max-width: 20rem;">
                <au-select placeholder="Choose a plan">
                    <option value="starter">Starter — $9/month</option>
                    <option value="growth">Growth — $29/month</option>
                    <option value="scale">Scale — $99/month</option>
                </au-select>
            </div>`,
    }),
};

export const Preselected = {
    args: {
        value: 'qld',
        placeholder: '',
    },
};

export const Disabled = {
    args: {
        disabled: true,
    },
};
