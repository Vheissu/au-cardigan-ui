import { AuCheckboxGroupCustomElement } from '../src/components/au-checkbox-group';
import { AuCheckboxCustomElement } from '../src/components/au-checkbox';

const meta = {
    title: 'Forms/Checkbox Group',
    component: AuCheckboxGroupCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-checkbox-group
            label.bind="label"
            orientation.bind="orientation"
            value.bind="value"
            disabled.bind="disabled"
            helper.bind="helper"
            error.bind="error">
            <au-checkbox value="email" label="Email"></au-checkbox>
            <au-checkbox value="sms" label="SMS"></au-checkbox>
            <au-checkbox value="push" label="Push notifications"></au-checkbox>
        </au-checkbox-group>`,
        props: args,
        components: [AuCheckboxCustomElement],
    }),
    args: {
        label: 'Notification channels',
        orientation: 'vertical',
        value: ['email'],
        disabled: false,
        helper: 'Choose how we should contact you.',
        error: '',
    },
    argTypes: {
        label: { control: 'text' },
        orientation: { control: 'select', options: ['vertical', 'horizontal'] },
        value: { control: 'object' },
        disabled: { control: 'boolean' },
        helper: { control: 'text' },
        error: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const Horizontal = {
    render: () => ({
        template: `
            <au-checkbox-group label="Working days" orientation="horizontal" value.bind="value">
                <au-checkbox value="mon" label="Mon"></au-checkbox>
                <au-checkbox value="tue" label="Tue"></au-checkbox>
                <au-checkbox value="wed" label="Wed"></au-checkbox>
                <au-checkbox value="thu" label="Thu"></au-checkbox>
                <au-checkbox value="fri" label="Fri"></au-checkbox>
            </au-checkbox-group>`,
        props: { value: ['mon', 'tue', 'wed'] },
        components: [AuCheckboxCustomElement],
    }),
};

export const WithError = {
    render: () => ({
        template: `
            <au-checkbox-group label="Pizza toppings" error="Pick at least one topping." value.bind="value">
                <au-checkbox value="mushroom" label="Mushroom"></au-checkbox>
                <au-checkbox value="olives" label="Olives"></au-checkbox>
                <au-checkbox value="capsicum" label="Capsicum"></au-checkbox>
            </au-checkbox-group>`,
        props: { value: [] },
        components: [AuCheckboxCustomElement],
    }),
};

export const DisabledGroup = {
    render: () => ({
        template: `
            <au-checkbox-group label="Add-ons (unavailable on your plan)" disabled.bind="true" value.bind="value" helper="Upgrade to the Growth plan to enable add-ons.">
                <au-checkbox value="analytics" label="Advanced analytics"></au-checkbox>
                <au-checkbox value="sso" label="Single sign-on"></au-checkbox>
                <au-checkbox value="audit" label="Audit log"></au-checkbox>
            </au-checkbox-group>`,
        props: { value: ['analytics'] },
        components: [AuCheckboxCustomElement],
    }),
};
