import { AuBadgeCustomElement } from '../src/components/au-badge';

const colors = ['primary', 'secondary', 'success', 'error', 'info', 'light', 'dark'];

const meta = {
    title: 'Content/Badge',
    component: AuBadgeCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-badge color.bind="color" size.bind="size">\${label}</au-badge>`,
        props: args,
    }),
    args: {
        label: 'New',
        color: 'primary',
        size: 'medium',
    },
    argTypes: {
        label: { control: 'text' },
        color: { control: 'select', options: colors },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
    },
};

export default meta;

export const Playground = {};

export const Colors = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                ${colors.map(color => `<au-badge color="${color}">${color}</au-badge>`).join('\n')}
            </div>`,
    }),
};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <au-badge color="primary" size="small">Small</au-badge>
                <au-badge color="primary" size="medium">Medium</au-badge>
                <au-badge color="primary" size="large">Large</au-badge>
            </div>`,
    }),
};

export const InContext = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem; max-width: 22rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Invoice #2041</span>
                    <au-badge color="success" size="small">Paid</au-badge>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Invoice #2042</span>
                    <au-badge color="info" size="small">Sent</au-badge>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Invoice #2043</span>
                    <au-badge color="error" size="small">Overdue</au-badge>
                </div>
            </div>`,
    }),
};
