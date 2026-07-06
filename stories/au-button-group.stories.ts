import { AuButtonGroupCustomElement } from '../src/components/au-button-group';
import { AuButtonCustomElement } from '../src/components/au-button';

const meta = {
    title: 'Actions/Button Group',
    component: AuButtonGroupCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-button-group orientation.bind="orientation" aria-label.bind="ariaLabel">
            <au-button color.bind="color" variant.bind="variant">Day</au-button>
            <au-button color.bind="color" variant.bind="variant">Week</au-button>
            <au-button color.bind="color" variant.bind="variant">Month</au-button>
            <au-button color.bind="color" variant.bind="variant">Year</au-button>
        </au-button-group>`,
        components: [AuButtonCustomElement],
        props: args,
    }),
    args: {
        orientation: 'horizontal',
        ariaLabel: 'Calendar view',
        color: 'primary',
        variant: 'outline',
    },
    argTypes: {
        orientation: { control: 'select', options: ['horizontal', 'vertical'] },
        ariaLabel: { control: 'text' },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'bright', 'purple', 'success', 'error', 'info', 'light', 'dark'],
        },
        variant: { control: 'select', options: ['solid', 'outline', 'ghost'] },
    },
};

export default meta;

export const Playground = {};

export const SegmentedControl = {
    render: () => ({
        template: `
            <au-button-group aria-label="Text alignment">
                <au-button color="primary" variant="solid">Left</au-button>
                <au-button color="primary" variant="outline">Center</au-button>
                <au-button color="primary" variant="outline">Right</au-button>
                <au-button color="primary" variant="outline">Justify</au-button>
            </au-button-group>`,
        components: [AuButtonCustomElement],
    }),
};

export const Vertical = {
    render: () => ({
        template: `
            <au-button-group orientation="vertical" aria-label="Zoom controls">
                <au-button color="secondary" variant="outline">Zoom in</au-button>
                <au-button color="secondary" variant="outline">Reset</au-button>
                <au-button color="secondary" variant="outline">Zoom out</au-button>
            </au-button-group>`,
        components: [AuButtonCustomElement],
    }),
};

export const Toolbar = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                <au-button-group aria-label="History">
                    <au-button color="dark" variant="ghost">Undo</au-button>
                    <au-button color="dark" variant="ghost">Redo</au-button>
                </au-button-group>
                <au-button-group aria-label="Formatting">
                    <au-button color="dark" variant="outline">Bold</au-button>
                    <au-button color="dark" variant="outline">Italic</au-button>
                    <au-button color="dark" variant="outline">Underline</au-button>
                </au-button-group>
                <au-button-group aria-label="Publish actions">
                    <au-button color="success" variant="solid">Publish</au-button>
                    <au-button color="success" variant="outline">Schedule</au-button>
                </au-button-group>
            </div>`,
        components: [AuButtonCustomElement],
    }),
};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
                <au-button-group aria-label="Small group">
                    <au-button color="primary" variant="outline" size="small">Copy</au-button>
                    <au-button color="primary" variant="outline" size="small">Move</au-button>
                    <au-button color="primary" variant="outline" size="small">Delete</au-button>
                </au-button-group>
                <au-button-group aria-label="Medium group">
                    <au-button color="primary" variant="outline" size="medium">Copy</au-button>
                    <au-button color="primary" variant="outline" size="medium">Move</au-button>
                    <au-button color="primary" variant="outline" size="medium">Delete</au-button>
                </au-button-group>
                <au-button-group aria-label="Large group">
                    <au-button color="primary" variant="outline" size="large">Copy</au-button>
                    <au-button color="primary" variant="outline" size="large">Move</au-button>
                    <au-button color="primary" variant="outline" size="large">Delete</au-button>
                </au-button-group>
            </div>`,
        components: [AuButtonCustomElement],
    }),
};
