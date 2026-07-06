import { AuDividerCustomElement } from '../src/components/au-divider';

const meta = {
    title: 'Content/Divider',
    component: AuDividerCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="display: flex; flex-direction: \${orientation === 'vertical' ? 'row' : 'column'}; gap: 1rem; height: \${orientation === 'vertical' ? '6rem' : 'auto'}; align-items: stretch; max-width: 28rem;">
            <span style="align-self: center;">Overview</span>
            <au-divider orientation.bind="orientation" label.bind="label"></au-divider>
            <span style="align-self: center;">Details</span>
        </div>`,
        props: args,
    }),
    args: {
        orientation: 'horizontal',
        label: '',
    },
    argTypes: {
        orientation: { control: 'select', options: ['horizontal', 'vertical'] },
        label: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const Horizontal = {
    render: () => ({
        template: `
            <div style="max-width: 28rem;">
                <p>Your changes have been saved to the draft.</p>
                <au-divider></au-divider>
                <p>Publishing makes the article visible to all subscribers.</p>
            </div>`,
    }),
};

export const WithLabel = {
    render: () => ({
        template: `
            <div style="max-width: 28rem;">
                <p>Sign in with your email address and password.</p>
                <au-divider label="or continue with"></au-divider>
                <p>Google · GitHub · Microsoft</p>
            </div>`,
    }),
};

export const Vertical = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1rem; height: 5rem; align-items: stretch;">
                <span style="align-self: center;">Drafts (4)</span>
                <au-divider orientation="vertical"></au-divider>
                <span style="align-self: center;">Published (12)</span>
                <au-divider orientation="vertical"></au-divider>
                <span style="align-self: center;">Archived (3)</span>
            </div>`,
    }),
};
