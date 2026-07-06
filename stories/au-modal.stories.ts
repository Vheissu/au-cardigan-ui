import { AuModalCustomElement } from '../src/components/au-modal';
import { AuButtonCustomElement } from '../src/components/au-button';

const meta = {
    title: 'Feedback/Modal',
    component: AuModalCustomElement,
    render: (args: Record<string, unknown>) => {
        const props = {
            ...args,
            close: () => {
                props.open = false;
            },
        };
        return {
            template: `
                <au-button color="primary" click.trigger="open = true">Open modal</au-button>
                <au-modal
                    if.bind="open"
                    size.bind="size"
                    label.bind="label"
                    click-close.bind="clickClose"
                    role.bind="role"
                    on-close.bind="close">
                    <h2 slot="heading" style="margin: 0;">\${heading}</h2>
                    <p>\${body}</p>
                    <div slot="footer" style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                        <au-button variant="ghost" color="dark" click.trigger="open = false">Cancel</au-button>
                        <au-button color="primary" click.trigger="open = false">Confirm</au-button>
                    </div>
                </au-modal>`,
            props,
            components: [AuButtonCustomElement],
        };
    },
    args: {
        open: true,
        size: 'sm',
        label: 'Confirm publish',
        heading: 'Publish article?',
        body: 'The article "Shipping web components with Aurelia" will be visible to all subscribers immediately.',
        clickClose: true,
        role: 'dialog',
    },
    argTypes: {
        open: { control: 'boolean' },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        label: { control: 'text' },
        heading: { control: 'text' },
        body: { control: 'text' },
        clickClose: { control: 'boolean' },
        role: { control: 'select', options: ['dialog', 'alertdialog'] },
    },
};

export default meta;

export const Playground = {};

export const LargeModal = {
    args: {
        open: true,
        size: 'lg',
        label: 'Release notes',
        heading: 'What changed in 2.4',
        body: 'This release adds a toast center, a skeleton loader and callouts, plus theming hooks for every component via CSS shadow parts.',
    },
};

export const AlertDialog = {
    args: {
        open: true,
        size: 'sm',
        role: 'alertdialog',
        clickClose: false,
        label: 'Delete project',
        heading: 'Delete this project?',
        body: 'This permanently removes the project and its 14 deployments. Clicking the backdrop will not close this dialog.',
    },
};
