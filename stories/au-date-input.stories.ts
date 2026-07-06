import { AuDateInputCustomElement } from '../src/components/au-date-input';

const meta = {
    title: 'Forms/Date Input',
    component: AuDateInputCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-date-input
            value.bind="value"
            label.bind="label"
            helper.bind="helper"
            error.bind="error"
            min.bind="min"
            max.bind="max"
            disabled.bind="disabled"
            required.bind="required"
            show-calendar.bind="showCalendar"
            first-day-of-week.bind="firstDayOfWeek"
            locale.bind="locale"></au-date-input>`,
        props: args,
    }),
    args: {
        value: '',
        label: 'Date of birth',
        helper: 'Format: DD/MM/YYYY',
        error: '',
        min: '',
        max: '',
        disabled: false,
        required: false,
        showCalendar: true,
        firstDayOfWeek: 1,
        locale: 'en-AU',
    },
    argTypes: {
        value: { control: 'text' },
        label: { control: 'text' },
        helper: { control: 'text' },
        error: { control: 'text' },
        min: { control: 'text' },
        max: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        showCalendar: { control: 'boolean' },
        firstDayOfWeek: { control: { type: 'number', min: 0, max: 6 } },
        locale: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const MinMaxConstraints = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-date-input
                    label="Appointment date"
                    value="2026-07-15"
                    min="2026-07-07"
                    max="2026-07-31"
                    helper="Bookings are open from 7 to 31 July 2026."></au-date-input>
            </div>`,
    }),
};

export const WithError = {
    args: {
        label: 'Policy start date',
        value: '2026-06-01',
        helper: '',
        error: 'Start date cannot be in the past.',
        required: true,
    },
};

export const WithoutCalendar = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-date-input
                    label="Card expiry date"
                    show-calendar.bind="false"
                    helper="Type the date directly; segments respond to arrow keys."></au-date-input>
            </div>`,
    }),
};

export const Disabled = {
    args: {
        label: 'Contract end date',
        value: '2027-01-31',
        helper: 'Set automatically from your contract terms.',
        disabled: true,
    },
};
