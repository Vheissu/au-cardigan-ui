import { AuAccordionCustomElement } from '../src/components/au-accordion';
import { AuAccordionItemCustomElement } from '../src/components/au-accordion-item';

const variants = ['default', 'bordered', 'contained'];

const meta = {
    title: 'Navigation/Accordion',
    component: AuAccordionCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-accordion
            multiple.bind="multiple"
            collapsible.bind="collapsible"
            variant.bind="variant">
            <au-accordion-item heading="How long does shipping take?" open.bind="true">
                <p>Orders placed before 2pm ship the same day. Standard delivery takes 3–5 business days; express delivery arrives the next business day.</p>
            </au-accordion-item>
            <au-accordion-item heading="What is your returns policy?">
                <p>You can return any unworn item within 60 days for a full refund. Return labels are included with every order.</p>
            </au-accordion-item>
            <au-accordion-item heading="Do you offer a warranty?">
                <p>All knitwear is covered by a two-year warranty against manufacturing defects, including seams and buttons.</p>
            </au-accordion-item>
        </au-accordion>`,
        components: [AuAccordionItemCustomElement],
        props: args,
    }),
    args: {
        multiple: false,
        collapsible: true,
        variant: 'default',
    },
    argTypes: {
        multiple: { control: 'boolean' },
        collapsible: { control: 'boolean' },
        variant: { control: 'select', options: variants },
    },
};

export default meta;

export const Playground = {};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${variants.map(variant => `
                <au-accordion variant="${variant}">
                    <au-accordion-item heading="Care instructions" open.bind="true">
                        <p>Hand wash cold and lay flat to dry. (variant: ${variant})</p>
                    </au-accordion-item>
                    <au-accordion-item heading="Materials">
                        <p>100% merino wool, sourced from certified farms.</p>
                    </au-accordion-item>
                </au-accordion>`).join('\n')}
            </div>`,
        components: [AuAccordionItemCustomElement],
    }),
};

export const MultipleOpen = {
    render: () => ({
        template: `
            <au-accordion multiple.bind="true" variant="bordered">
                <au-accordion-item heading="Getting started" open.bind="true">
                    <p>Install the package, register the components you need and import the shared CSS variables.</p>
                </au-accordion-item>
                <au-accordion-item heading="Theming" open.bind="true">
                    <p>Override the CSS custom properties on <code>:root</code> to restyle every component at once.</p>
                </au-accordion-item>
                <au-accordion-item heading="Accessibility">
                    <p>Each trigger is a real button wired with <code>aria-expanded</code> and <code>aria-controls</code>.</p>
                </au-accordion-item>
            </au-accordion>`,
        components: [AuAccordionItemCustomElement],
    }),
};

export const WithDescriptionsAndDisabled = {
    render: () => ({
        template: `
            <au-accordion variant="contained">
                <au-accordion-item heading="Profile" description="Name, avatar and public bio">
                    <p>Update the details other members see on your public profile.</p>
                </au-accordion-item>
                <au-accordion-item heading="Security" description="Password and two-factor authentication">
                    <p>Rotate your password and manage authenticator apps.</p>
                </au-accordion-item>
                <au-accordion-item heading="Enterprise SSO" description="Available on the Business plan" disabled.bind="true">
                    <p>Configure SAML single sign-on for your organisation.</p>
                </au-accordion-item>
            </au-accordion>`,
        components: [AuAccordionItemCustomElement],
    }),
};

export const CustomHeadingSlot = {
    render: () => ({
        template: `
            <au-accordion variant="bordered">
                <au-accordion-item open.bind="true">
                    <div slot="heading" style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; background: #16a34a;"></span>
                        <strong>API status</strong>
                        <span style="font-size: 0.8em; color: #16a34a;">Operational</span>
                    </div>
                    <p>All systems normal. Last incident resolved 41 days ago.</p>
                </au-accordion-item>
                <au-accordion-item heading="Scheduled maintenance">
                    <p>Database upgrades are planned for Saturday 02:00–03:00 UTC.</p>
                </au-accordion-item>
            </au-accordion>`,
        components: [AuAccordionItemCustomElement],
    }),
};
