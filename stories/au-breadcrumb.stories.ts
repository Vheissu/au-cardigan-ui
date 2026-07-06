import { AuBreadcrumbCustomElement } from '../src/components/au-breadcrumb';
import { AuBreadcrumbItemCustomElement } from '../src/components/au-breadcrumb-item';

const meta = {
    title: 'Navigation/Breadcrumb',
    component: AuBreadcrumbCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-breadcrumb separator.bind="separator" aria-label.bind="ariaLabel">
            <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
            <au-breadcrumb-item href="/components">Components</au-breadcrumb-item>
            <au-breadcrumb-item>Carousel</au-breadcrumb-item>
        </au-breadcrumb>`,
        components: [AuBreadcrumbItemCustomElement],
        props: args,
    }),
    args: {
        separator: '/',
        ariaLabel: 'breadcrumb',
    },
    argTypes: {
        separator: { control: 'text' },
        ariaLabel: { control: 'text' },
    },
};

export default meta;

export const Playground = {};

export const Separators = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${['/', '›', '→', '•'].map(separator => `
                <au-breadcrumb separator="${separator}">
                    <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
                    <au-breadcrumb-item href="/docs">Docs</au-breadcrumb-item>
                    <au-breadcrumb-item href="/docs/navigation">Navigation</au-breadcrumb-item>
                    <au-breadcrumb-item>Breadcrumb</au-breadcrumb-item>
                </au-breadcrumb>`).join('\n')}
            </div>`,
        components: [AuBreadcrumbItemCustomElement],
    }),
};

export const DeepPath = {
    render: () => ({
        template: `
            <au-breadcrumb separator="›">
                <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
                <au-breadcrumb-item href="/catalogue">Catalogue</au-breadcrumb-item>
                <au-breadcrumb-item href="/catalogue/knitwear">Knitwear</au-breadcrumb-item>
                <au-breadcrumb-item href="/catalogue/knitwear/cardigans">Cardigans</au-breadcrumb-item>
                <au-breadcrumb-item>Merino shawl-collar cardigan</au-breadcrumb-item>
            </au-breadcrumb>`,
        components: [AuBreadcrumbItemCustomElement],
    }),
};

export const CurrentPageLink = {
    render: () => ({
        template: `
            <au-breadcrumb>
                <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
                <au-breadcrumb-item href="/settings">Settings</au-breadcrumb-item>
                <au-breadcrumb-item href="/settings/billing" current.bind="true">Billing</au-breadcrumb-item>
            </au-breadcrumb>
            <p style="margin-top: 0.75rem; font-size: 0.85em; opacity: 0.7;">
                The last item keeps its <code>href</code> but is marked <code>current</code>, so it renders with <code>aria-current="page"</code>.
            </p>`,
        components: [AuBreadcrumbItemCustomElement],
    }),
};
