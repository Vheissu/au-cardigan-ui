import { AuColorPickerCustomElement } from '../src/components/au-color-picker';

const meta = {
    title: 'Forms/Color Picker',
    component: AuColorPickerCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-color-picker
            value.bind="value"
            label.bind="label"
            helper.bind="helper"
            error.bind="error"
            disabled.bind="disabled"
            swatches.bind="swatches"
            show-input.bind="showInput"></au-color-picker>`,
        props: args,
    }),
    args: {
        value: '#0466C8',
        label: 'Brand colour',
        helper: 'Used for buttons and links across your site.',
        error: '',
        disabled: false,
        swatches: ['#0466C8', '#495057', '#FF6B6B', '#6610F2', '#52B788', '#DC3545', '#00B4D8', '#ADE8F4'],
        showInput: true,
    },
    argTypes: {
        value: { control: 'color' },
        label: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        disabled: { control: 'boolean' },
        swatches: { control: 'object' },
        showInput: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const CustomSwatches = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-color-picker
                    label="Chart series colour"
                    value="#E76F51"
                    swatches.bind="swatches"></au-color-picker>
            </div>`,
        props: {
            swatches: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
        },
    }),
};

export const SwatchesOnly = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-color-picker
                    label="Highlight colour"
                    value="#52B788"
                    show-input.bind="false"
                    helper="Pick from the preset palette."></au-color-picker>
            </div>`,
    }),
};

export const WithError = {
    args: {
        label: 'Background colour',
        value: '#FFFFFF',
        helper: '',
        error: 'Contrast against body text is too low.',
    },
};

export const Disabled = {
    args: {
        label: 'Theme colour',
        helper: 'Locked by your organisation theme.',
        disabled: true,
    },
};
