import { AuHeadingCustomElement } from '../src/components/au-heading';

const colors = ['white', 'light', 'dark', 'primary', 'success', 'info', 'error', 'bright', 'skyBlue', 'purple', 'blueAlt'];

const meta = {
    title: 'Content/Heading',
    component: AuHeadingCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-heading
            level.bind="level"
            size.bind="size"
            color.bind="color"
            overflow.bind="overflow"
            truncate.bind="truncate">\${text}</au-heading>`,
        props: args,
    }),
    args: {
        text: 'Design once, ship everywhere',
        level: '1',
        size: 'medium',
        color: 'dark',
        overflow: 'normal',
        truncate: false,
    },
    argTypes: {
        text: { control: 'text' },
        level: { control: 'select', options: ['1', '2', '3', '4', '5', '6'] },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        color: { control: 'select', options: colors },
        overflow: { control: 'select', options: ['normal', 'breakWord'] },
        truncate: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Levels = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${['1', '2', '3', '4', '5', '6'].map(level => `<au-heading level="${level}">Heading level ${level}</au-heading>`).join('\n')}
            </div>`,
    }),
};

export const Colors = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; background: #d8dde3;">
                ${colors.map(color => `<au-heading level="3" color="${color}">${color}</au-heading>`).join('\n')}
            </div>`,
    }),
};

export const Truncated = {
    render: () => ({
        template: `
            <div style="max-width: 18rem; border: 1px dashed #cbd2d9; padding: 0.5rem;">
                <au-heading level="3" truncate.bind="true">The release notes for version 2.4 cover every component change in detail</au-heading>
            </div>`,
    }),
};
