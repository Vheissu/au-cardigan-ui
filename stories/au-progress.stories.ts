import { AuProgressCustomElement } from '../src/components/au-progress';

const colors = ['primary', 'secondary', 'success', 'error', 'info', 'light', 'dark'];

const meta = {
    title: 'Feedback/Progress',
    component: AuProgressCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 24rem;">
            <au-progress value.bind="value" max.bind="max" color.bind="color"></au-progress>
        </div>`,
        props: args,
    }),
    args: {
        value: 40,
        max: 100,
        color: 'primary',
    },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100 } },
        max: { control: 'number' },
        color: { control: 'select', options: colors },
    },
};

export default meta;

export const Playground = {};

export const Colors = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 24rem;">
                ${colors.map((color, index) => `<au-progress color="${color}" value="${(index + 2) * 12}" max="100"></au-progress>`).join('\n')}
            </div>`,
    }),
};

export const UploadStates = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 24rem;">
                <div>
                    <p style="margin: 0 0 0.25rem;">photos.zip — 25%</p>
                    <au-progress value="25" max="100" color="info"></au-progress>
                </div>
                <div>
                    <p style="margin: 0 0 0.25rem;">report.pdf — 80%</p>
                    <au-progress value="80" max="100" color="primary"></au-progress>
                </div>
                <div>
                    <p style="margin: 0 0 0.25rem;">backup.tar — complete</p>
                    <au-progress value="100" max="100" color="success"></au-progress>
                </div>
            </div>`,
    }),
};

export const CustomMax = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <p style="margin: 0 0 0.25rem;">3 of 8 steps completed</p>
                <au-progress value="3" max="8" color="secondary"></au-progress>
            </div>`,
    }),
};
