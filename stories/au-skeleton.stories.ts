import { AuSkeletonCustomElement } from '../src/components/au-skeleton';

const meta = {
    title: 'Feedback/Skeleton',
    component: AuSkeletonCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 24rem;">
            <au-skeleton
                shape.bind="shape"
                width.bind="width"
                height.bind="height"
                lines.bind="lines"
                animated.bind="animated"
                radius.bind="radius"
                aria-label.bind="ariaLabel"></au-skeleton>
        </div>`,
        props: args,
    }),
    args: {
        shape: 'text',
        width: '100%',
        height: '1rem',
        lines: 3,
        animated: true,
        radius: '0.5rem',
        ariaLabel: 'Loading placeholder',
    },
    argTypes: {
        shape: { control: 'select', options: ['text', 'circle', 'rect', 'avatar'] },
        width: { control: 'text' },
        height: { control: 'text' },
        lines: { control: 'number' },
        animated: { control: 'boolean' },
        radius: { control: 'text' },
        ariaLabel: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const TextParagraph = {
    render: () => ({
        template: `
            <div style="max-width: 24rem;">
                <au-skeleton shape="text" lines.bind="4"></au-skeleton>
            </div>`,
    }),
};

export const Shapes = {
    render: () => ({
        template: `
            <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                <au-skeleton shape="circle" width="4rem" height="4rem"></au-skeleton>
                <au-skeleton shape="rect" width="10rem" height="6rem"></au-skeleton>
                <au-skeleton shape="rect" width="8rem" height="2.25rem" radius="1.25rem"></au-skeleton>
            </div>`,
    }),
};

export const CardPlaceholder = {
    render: () => ({
        template: `
            <div style="max-width: 22rem; border: 1px solid #e4e7eb; border-radius: 0.75rem; padding: 1rem;">
                <au-skeleton shape="rect" width="100%" height="9rem" radius="0.5rem"></au-skeleton>
                <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1rem;">
                    <au-skeleton shape="circle" width="2.5rem" height="2.5rem"></au-skeleton>
                    <div style="flex: 1;">
                        <au-skeleton shape="text" lines.bind="2" height="0.75rem"></au-skeleton>
                    </div>
                </div>
            </div>`,
    }),
};

export const Static = {
    args: {
        animated: false,
        lines: 2,
    },
};
