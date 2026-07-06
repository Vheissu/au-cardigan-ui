import { AuCodeCustomElement } from '../src/components/au-code';

const meta = {
    title: 'Content/Code',
    component: AuCodeCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-code
            type.bind="type"
            language.bind="language"
            copyable.bind="copyable">\${code}</au-code>`,
        props: args,
    }),
    args: {
        code: "const total = items.reduce((sum, item) => sum + item.price, 0);",
        type: 'pre',
        language: 'javascript',
        copyable: false,
    },
    argTypes: {
        code: { control: 'text' },
        type: { control: 'select', options: ['pre', 'code'] },
        language: { control: 'text' },
        copyable: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Block = {
    render: () => ({
        template: `<au-code type="pre" language="typescript">export class GreeterCustomElement { public message = 'Hello, Aurelia'; }</au-code>`,
    }),
};

export const Inline = {
    render: () => ({
        template: `
            <p style="max-width: 40rem;">
                Run <au-code type="code">npm run build</au-code> to produce the library bundle, then
                <au-code type="code">npm publish</au-code> to push it to the registry.
            </p>`,
    }),
};

export const Copyable = {
    render: () => ({
        template: `<au-code type="pre" language="bash" copyable.bind="true">npm install @aurelia/runtime-html cardigan-ui</au-code>`,
    }),
};
