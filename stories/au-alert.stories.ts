import { AuAlertCustomElement } from '../src/components/au-alert';

const colors = ['primary', 'secondary', 'success', 'error', 'info', 'light', 'dark'];

const meta = {
    title: 'Feedback/Alert',
    component: AuAlertCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-alert color.bind="color" dismissible.bind="dismissible">\${message}</au-alert>`,
        props: args,
    }),
    args: {
        message: 'Your profile changes have been saved.',
        color: 'primary',
        dismissible: false,
    },
    argTypes: {
        message: { control: 'text' },
        color: { control: 'select', options: colors },
        dismissible: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Colors = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 32rem;">
                ${colors.map(color => `<au-alert color="${color}">This is a ${color} alert.</au-alert>`).join('\n')}
            </div>`,
    }),
};

export const Dismissible = {
    render: () => ({
        template: `
            <div style="max-width: 32rem;">
                <au-alert color="info" dismissible.bind="true">
                    A new version of the dashboard is available. Refresh to update.
                </au-alert>
            </div>`,
    }),
};

export const SuccessAndError = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 32rem;">
                <au-alert color="success">Backup completed — 1,204 files copied to cold storage.</au-alert>
                <au-alert color="error" dismissible.bind="true">Payment failed: the card ending in 4021 was declined.</au-alert>
            </div>`,
    }),
};
