import { AuTabsCustomElement } from '../src/components/au-tabs';
import { AuTabPanelCustomElement } from '../src/components/au-tab-panel';

const variants = ['default', 'pill', 'underline', 'soft'];

const meta = {
    title: 'Navigation/Tabs',
    component: AuTabsCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<au-tabs
            orientation.bind="orientation"
            activation.bind="activation"
            variant.bind="variant"
            stretch.bind="stretch">
            <au-tab-panel label="Overview">
                <p>The Cardigan carousel ships with keyboard navigation, looping and optional autoplay that respects reduced-motion preferences.</p>
            </au-tab-panel>
            <au-tab-panel label="Specifications">
                <ul>
                    <li>Bundle size: 4.2 kB gzipped</li>
                    <li>Dependencies: none beyond Aurelia 2</li>
                    <li>Browser support: evergreen</li>
                </ul>
            </au-tab-panel>
            <au-tab-panel label="Reviews">
                <p>"Dropped straight into our design system with zero fuss." — Platform team, Fern &amp; Co.</p>
            </au-tab-panel>
        </au-tabs>`,
        components: [AuTabPanelCustomElement],
        props: args,
    }),
    args: {
        orientation: 'horizontal',
        activation: 'auto',
        variant: 'default',
        stretch: false,
    },
    argTypes: {
        orientation: { control: 'select', options: ['horizontal', 'vertical'] },
        activation: { control: 'select', options: ['auto', 'manual'] },
        variant: { control: 'select', options: variants },
        stretch: { control: 'boolean' },
    },
};

export default meta;

export const Playground = {};

export const Variants = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${variants.map(variant => `
                <au-tabs variant="${variant}">
                    <au-tab-panel label="Account">
                        <p>Manage your profile, email address and password. (variant: ${variant})</p>
                    </au-tab-panel>
                    <au-tab-panel label="Notifications">
                        <p>Choose which product updates and mentions reach your inbox.</p>
                    </au-tab-panel>
                    <au-tab-panel label="Billing">
                        <p>View invoices, update the payment method and change plans.</p>
                    </au-tab-panel>
                </au-tabs>`).join('\n')}
            </div>`,
        components: [AuTabPanelCustomElement],
    }),
};

export const Vertical = {
    render: () => ({
        template: `
            <au-tabs orientation="vertical" variant="soft">
                <au-tab-panel label="General">
                    <p>Workspace name, default language and time zone.</p>
                </au-tab-panel>
                <au-tab-panel label="Members">
                    <p>Invite teammates and manage their roles.</p>
                </au-tab-panel>
                <au-tab-panel label="Integrations">
                    <p>Connect Slack, GitHub and your issue tracker.</p>
                </au-tab-panel>
                <au-tab-panel label="Danger zone">
                    <p>Transfer ownership or delete this workspace.</p>
                </au-tab-panel>
            </au-tabs>`,
        components: [AuTabPanelCustomElement],
    }),
};

export const WithIconsAndDisabled = {
    render: () => ({
        template: `
            <au-tabs variant="pill">
                <au-tab-panel label="Inbox" icon="📥">
                    <p>12 unread conversations.</p>
                </au-tab-panel>
                <au-tab-panel label="Sent" icon="📤">
                    <p>Messages you have sent in the last 30 days.</p>
                </au-tab-panel>
                <au-tab-panel label="Archive" icon="🗄️" disabled.bind="true">
                    <p>Archived conversations are unavailable on this plan.</p>
                </au-tab-panel>
            </au-tabs>`,
        components: [AuTabPanelCustomElement],
    }),
};

export const LazyContent = {
    render: () => ({
        template: `
            <au-tabs variant="underline">
                <au-tab-panel label="Summary">
                    <p>This panel renders immediately.</p>
                </au-tab-panel>
                <au-tab-panel label="Heavy report" lazy.bind="true">
                    <p>This panel is marked <code>lazy</code>, so its content is only rendered once the tab is first activated.</p>
                </au-tab-panel>
            </au-tabs>`,
        components: [AuTabPanelCustomElement],
    }),
};
