import { AuButtonCustomElement } from '../src/components/au-button';

const colors = ['primary', 'secondary', 'bright', 'purple', 'success', 'error', 'info', 'light', 'dark'];

const meta = {
    title: 'Actions/Button',
    component: AuButtonCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-button
            color.bind="color"
            variant.bind="variant"
            size.bind="size"
            disabled.bind="disabled"
            loading.bind="loading"
            full-width.bind="fullWidth">\${label}</au-button>`,
        props: args,
    }),
    args: {
        label: 'Button',
        color: 'primary',
        variant: 'solid',
        size: 'medium',
        disabled: false,
        loading: false,
        fullWidth: false,
    },
    argTypes: {
        label: { control: 'text' },
        color: { control: 'select', options: colors },
        variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
        size: { control: 'select', options: ['small', 'medium', 'large', 'xlarge'] },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                <au-button color="primary" variant="solid">Solid</au-button>
                <au-button color="primary" variant="outline">Outline</au-button>
                <au-button color="primary" variant="ghost">Ghost</au-button>
            </div>`,
    }),
};

export const Colors = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                ${colors.map(color => `<au-button color="${color}">${color}</au-button>`).join('\n')}
            </div>`,
    }),
};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                <au-button color="primary" size="small">Small</au-button>
                <au-button color="primary" size="medium">Medium</au-button>
                <au-button color="primary" size="large">Large</au-button>
                <au-button color="primary" size="xlarge">X-Large</au-button>
            </div>`,
    }),
};

export const Loading = {
    args: {
        label: 'Saving…',
        loading: true,
    },
};
