import { AuAvatarCustomElement } from '../src/components/au-avatar';

const meta = {
    title: 'Content/Avatar',
    component: AuAvatarCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-avatar
            src.bind="src"
            alt.bind="alt"
            initials.bind="initials"
            size.bind="size"></au-avatar>`,
        props: args,
    }),
    args: {
        src: 'https://picsum.photos/seed/avatar-jess/96/96',
        alt: 'Portrait of Jess Nguyen',
        initials: 'JN',
        size: 'medium',
    },
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
        initials: { control: 'text' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
    },
};

export default meta;

export const Playground = {};

export const Sizes = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <au-avatar size="small" src="https://picsum.photos/seed/avatar-sm/64/64" alt="Small avatar"></au-avatar>
                <au-avatar size="medium" src="https://picsum.photos/seed/avatar-md/96/96" alt="Medium avatar"></au-avatar>
                <au-avatar size="large" src="https://picsum.photos/seed/avatar-lg/128/128" alt="Large avatar"></au-avatar>
            </div>`,
    }),
};

export const InitialsFallback = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <au-avatar initials="DC" size="small"></au-avatar>
                <au-avatar initials="MK" size="medium"></au-avatar>
                <au-avatar initials="AT" size="large"></au-avatar>
            </div>`,
    }),
};

export const TeamList = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 20rem;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <au-avatar size="small" src="https://picsum.photos/seed/avatar-1/64/64" alt="Priya Sharma"></au-avatar>
                    <span>Priya Sharma · Engineering</span>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <au-avatar size="small" src="https://picsum.photos/seed/avatar-2/64/64" alt="Tom Reilly"></au-avatar>
                    <span>Tom Reilly · Design</span>
                </div>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <au-avatar size="small" initials="LW"></au-avatar>
                    <span>Lena Wu · Product</span>
                </div>
            </div>`,
    }),
};
