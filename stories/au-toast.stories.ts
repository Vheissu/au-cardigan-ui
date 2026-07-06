import { AuToastCustomElement } from '../src/components/au-toast';
import { AuToastCenterCustomElement } from '../src/components/au-toast-center';
import { AuButtonCustomElement } from '../src/components/au-button';

const types = ['info', 'success', 'warning', 'danger', 'neutral'];

const meta = {
    title: 'Feedback/Toast',
    component: AuToastCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 24rem;">
            <au-toast
                type.bind="type"
                title.bind="title"
                message.bind="message"
                dismissible.bind="dismissible"
                action-label.bind="actionLabel"
                action-callback.bind="actionCallback"></au-toast>
        </div>`,
        props: args,
    }),
    args: {
        type: 'info',
        title: 'Sync complete',
        message: 'Your workspace is up to date with the server.',
        dismissible: true,
        actionLabel: '',
        actionCallback: null,
    },
    argTypes: {
        type: { control: 'select', options: types },
        title: { control: 'text' },
        message: { control: 'text' },
        dismissible: { control: 'boolean' },
        actionLabel: { control: 'text' },
        actionCallback: { control: false },
    },
};

export default meta;

export const Playground = {};

export const Types = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
                <au-toast type="info" title="Heads up" message="A new teammate joined the project."></au-toast>
                <au-toast type="success" title="Deployed" message="Build 512 is live in production."></au-toast>
                <au-toast type="warning" title="Slow queries" message="Two dashboard queries exceeded 3 seconds."></au-toast>
                <au-toast type="danger" title="Webhook failing" message="Deliveries to billing-events have failed 5 times."></au-toast>
                <au-toast type="neutral" title="Reminder" message="Weekly report is due tomorrow at 10:00."></au-toast>
            </div>`,
    }),
};

export const WithAction = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-toast
                    type="info"
                    title="Message archived"
                    message="The conversation was moved to the archive."
                    action-label="Undo"
                    action-callback.bind="undo"></au-toast>
            </div>`,
        props: {
            undo: () => {
                console.log('Undo archive requested');
            },
        },
    }),
};

export const ToastCenter = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <au-button color="success" click.trigger="notifySuccess(center)">Show success</au-button>
                <au-button color="error" click.trigger="notifyError(center)">Show error</au-button>
                <au-button color="dark" variant="outline" click.trigger="center.clear()">Clear all</au-button>
            </div>
            <au-toast-center view-model.ref="center" position="top-right" limit.bind="4"></au-toast-center>`,
        props: {
            notifySuccess: (center: AuToastCenterCustomElement) => center.show({
                type: 'success',
                title: 'Export complete',
                message: 'invoices-june.csv is ready to download.',
            }),
            notifyError: (center: AuToastCenterCustomElement) => center.show({
                type: 'danger',
                title: 'Upload failed',
                message: 'logo.svg exceeds the 2 MB limit.',
                timeout: 0,
            }),
        },
        components: [AuToastCenterCustomElement, AuButtonCustomElement],
    }),
};
