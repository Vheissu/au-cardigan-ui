import { AuSpinnerCustomElement } from '../src/components/au-spinner';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const variants = ['primary', 'secondary', 'inverted', 'success', 'danger'];

const meta = {
    title: 'Feedback/Spinner',
    component: AuSpinnerCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-spinner
            size.bind="size"
            variant.bind="variant"
            label.bind="label"
            paused.bind="paused"></au-spinner>`,
        props: args,
    }),
    args: {
        size: 'md',
        variant: 'primary',
        label: 'Loading',
        paused: false,
    },
    argTypes: {
        size: { control: 'select', options: sizes },
        variant: { control: 'select', options: variants },
        label: { control: 'text' },
        paused: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1.5rem; align-items: center;">
                ${sizes.map(size => `<au-spinner size="${size}" label="Loading (${size})"></au-spinner>`).join('\n')}
            </div>`,
    }),
};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1.5rem; align-items: center;">
                <au-spinner variant="primary" label="Primary spinner"></au-spinner>
                <au-spinner variant="secondary" label="Secondary spinner"></au-spinner>
                <au-spinner variant="success" label="Success spinner"></au-spinner>
                <au-spinner variant="danger" label="Danger spinner"></au-spinner>
                <span style="display: inline-flex; padding: 1rem; background: #1f2933; border-radius: 0.5rem;">
                    <au-spinner variant="inverted" label="Inverted spinner"></au-spinner>
                </span>
            </div>`,
    }),
};

export const Paused = {
    args: {
        paused: true,
        label: 'Paused while offline',
    },
};
