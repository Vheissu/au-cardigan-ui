import { AuTextareaCustomElement } from '../src/components/au-textarea';

const meta = {
    title: 'Forms/Textarea',
    component: AuTextareaCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-textarea
            label.bind="label"
            value.bind="value"
            placeholder.bind="placeholder"
            helper.bind="helper"
            error.bind="error"
            rows.bind="rows"
            resize.bind="resize"
            maxlength.bind="maxlength"
            disabled.bind="disabled"
            readonly.bind="readonly"
            required.bind="required"></au-textarea>`,
        props: args,
    }),
    args: {
        label: 'Delivery instructions',
        value: '',
        placeholder: 'Leave the parcel behind the side gate…',
        helper: 'Visible to the courier only.',
        error: '',
        rows: 3,
        resize: 'vertical',
        maxlength: 500,
        disabled: false,
        readonly: false,
        required: false,
    },
    argTypes: {
        label: { control: 'text' },
        value: { control: 'text' },
        placeholder: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        rows: { control: { type: 'number', min: 1, max: 20 } },
        resize: { control: 'select', options: ['vertical', 'horizontal', 'both', 'none'] },
        maxlength: { control: 'number' },
        disabled: { control: 'boolean' },
        readonly: { control: 'boolean' },
        required: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const WithError = {
    args: {
        label: 'Feedback',
        value: 'Too short',
        helper: '',
        error: 'Feedback must be at least 20 characters.',
        required: true,
    },
};

export const ResizeBehaviour = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem;">
                <au-textarea label="Vertical resize (default)" resize="vertical" rows="2"></au-textarea>
                <au-textarea label="No resize" resize="none" rows="2"></au-textarea>
                <au-textarea label="Resize both directions" resize="both" rows="2"></au-textarea>
            </div>`,
    }),
};

export const DisabledAndReadonly = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 28rem;">
                <au-textarea label="Original request" value="Please update the shipping address on order #4021." readonly rows="2"></au-textarea>
                <au-textarea label="Internal notes" value="Escalated to warehouse team." disabled rows="2"></au-textarea>
            </div>`,
    }),
};
