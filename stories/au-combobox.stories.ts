import { AuComboboxCustomElement } from '../src/components/au-combobox';

const countryOptions = [
    { value: 'au', label: 'Australia' },
    { value: 'nz', label: 'New Zealand' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
];

const meta = {
    title: 'Forms/Combobox',
    component: AuComboboxCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-combobox
            options.bind="options"
            value.bind="value"
            label.bind="label"
            placeholder.bind="placeholder"
            helper.bind="helper"
            error.bind="error"
            disabled.bind="disabled"
            free-text.bind="freeText"
            no-results-text.bind="noResultsText"></au-combobox>`,
        props: args,
    }),
    args: {
        options: countryOptions,
        value: '',
        label: 'Country',
        placeholder: 'Start typing a country…',
        helper: 'Used for shipping estimates.',
        error: '',
        disabled: false,
        freeText: false,
        noResultsText: 'No matching countries',
    },
    argTypes: {
        options: { control: 'object' },
        value: { control: 'text' },
        label: { control: 'text' },
        placeholder: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        disabled: { control: 'boolean' },
        freeText: { control: 'boolean' },
        noResultsText: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const StringOptions = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-combobox
                    label="Favourite framework"
                    placeholder="Search frameworks…"
                    options.bind="options"></au-combobox>
            </div>`,
        props: {
            options: ['Aurelia', 'Vue', 'Svelte', 'React', 'Angular', 'Solid'],
        },
    }),
};

export const FreeText = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-combobox
                    label="Job title"
                    placeholder="Pick one or type your own"
                    free-text.bind="true"
                    helper="Not on the list? Just type it and press Enter."
                    options.bind="options"></au-combobox>
            </div>`,
        props: {
            options: ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst'],
        },
    }),
};

export const WithError = {
    args: {
        value: '',
        helper: '',
        error: 'Select a country to continue.',
    },
};

export const Disabled = {
    args: {
        value: 'au',
        helper: 'Determined by your billing address.',
        disabled: true,
    },
};
