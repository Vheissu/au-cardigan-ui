import { AuTooltipCustomElement } from '../src/components/au-tooltip';
import { AuButtonCustomElement } from '../src/components/au-button';

const positions = ['top', 'bottom', 'left', 'right'];

const meta = {
    title: 'Feedback/Tooltip',
    component: AuTooltipCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="display: flex; justify-content: center; padding: 5rem;">
            <au-tooltip message.bind="message" position.bind="position">
                <au-button color="primary">Hover me</au-button>
            </au-tooltip>
        </div>`,
        props: args,
        components: [AuButtonCustomElement],
    }),
    args: {
        message: 'Publishes the draft to all subscribers',
        position: 'top',
    },
    argTypes: {
        message: { control: 'text' },
        position: { control: 'select', options: positions },
    },
};

export default meta;

export const Playground = {};

export const Positions = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 3rem; justify-content: center; padding: 6rem 4rem;">
                ${positions.map(position => `
                <au-tooltip message="Tooltip on the ${position}" position="${position}">
                    <au-button variant="outline" color="dark">${position}</au-button>
                </au-tooltip>`).join('\n')}
            </div>`,
        components: [AuButtonCustomElement],
    }),
};

export const OnText = {
    render: () => ({
        template: `
            <p style="max-width: 32rem; padding: 4rem 1rem;">
                Invoices are finalised at the end of each billing period. Learn more about
                <au-tooltip message="Usage is metered hourly and billed monthly" position="top">
                    <span style="text-decoration: underline dotted; cursor: help;">metered billing</span>
                </au-tooltip>
                in the documentation.
            </p>`,
    }),
};

export const LongMessage = {
    render: () => ({
        template: `
            <div style="display: flex; justify-content: center; padding: 6rem 2rem;">
                <au-tooltip message="Rotating this key immediately invalidates the previous one. Services using the old key will start failing within 60 seconds." position="bottom">
                    <au-button color="error" variant="outline">Rotate API key</au-button>
                </au-tooltip>
            </div>`,
        components: [AuButtonCustomElement],
    }),
};
