import { AuMenuCustomElement } from '../src/components/au-menu';
import { AuMenuItemCustomElement } from '../src/components/au-menu-item';
import { AuMenuLabelCustomElement } from '../src/components/au-menu-label';

const meta = {
    title: 'Navigation/Menu',
    component: AuMenuCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `<div style="max-width: 16rem;" menu-select.trigger="selected = $event.detail">
            <au-menu>
                <au-menu-label>Workspace</au-menu-label>
                <au-menu-item value="dashboard">Dashboard</au-menu-item>
                <au-menu-item value="projects">Projects</au-menu-item>
                <au-menu-item value="reports" disabled.bind="reportsDisabled">Reports</au-menu-item>
                <au-menu-label>Account</au-menu-label>
                <au-menu-item value="profile">Profile</au-menu-item>
                <au-menu-item value="sign-out">Sign out</au-menu-item>
            </au-menu>
            <p style="margin-top: 0.75rem; font-size: 0.85em;">Selected: <strong>\${selected || 'nothing yet'}</strong></p>
        </div>`,
        components: [AuMenuItemCustomElement, AuMenuLabelCustomElement],
        props: args,
    }),
    args: {
        reportsDisabled: true,
        selected: '',
    },
    argTypes: {
        reportsDisabled: {
            control: 'boolean',
            description: 'Toggles the disabled state of the Reports item',
        },
        selected: { control: false },
    },
};

export default meta;

export const Playground = {};

export const SimpleList = {
    render: () => ({
        template: `
            <div style="max-width: 14rem;">
                <au-menu>
                    <au-menu-item value="cut">Cut</au-menu-item>
                    <au-menu-item value="copy">Copy</au-menu-item>
                    <au-menu-item value="paste">Paste</au-menu-item>
                    <au-menu-item value="delete">Delete</au-menu-item>
                </au-menu>
            </div>`,
        components: [AuMenuItemCustomElement],
    }),
};

export const GroupedWithLabels = {
    render: () => ({
        template: `
            <div style="max-width: 16rem;">
                <au-menu>
                    <au-menu-label>File</au-menu-label>
                    <au-menu-item value="new-file">New file</au-menu-item>
                    <au-menu-item value="open">Open…</au-menu-item>
                    <au-menu-item value="save">Save</au-menu-item>
                    <au-menu-label>Export</au-menu-label>
                    <au-menu-item value="export-pdf">Export as PDF</au-menu-item>
                    <au-menu-item value="export-png">Export as PNG</au-menu-item>
                </au-menu>
            </div>`,
        components: [AuMenuItemCustomElement, AuMenuLabelCustomElement],
    }),
};

export const DisabledItems = {
    render: () => ({
        template: `
            <div style="max-width: 16rem;">
                <au-menu>
                    <au-menu-label>Deployment</au-menu-label>
                    <au-menu-item value="deploy">Deploy to production</au-menu-item>
                    <au-menu-item value="rollback" disabled.bind="true">Roll back (no previous release)</au-menu-item>
                    <au-menu-item value="logs">View logs</au-menu-item>
                    <au-menu-item value="destroy" disabled.bind="true">Destroy environment</au-menu-item>
                </au-menu>
                <p style="margin-top: 0.75rem; font-size: 0.85em; opacity: 0.7;">
                    Disabled items ignore clicks and do not fire <code>menu-select</code>. Focus the menu and use the arrow keys or type to jump to an item.
                </p>
            </div>`,
        components: [AuMenuItemCustomElement, AuMenuLabelCustomElement],
    }),
};
