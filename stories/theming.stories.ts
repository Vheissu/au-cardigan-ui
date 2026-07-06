import { AuAlertCustomElement } from '../src/components/au-alert';
import { AuBadgeCustomElement } from '../src/components/au-badge';
import { AuButtonCustomElement } from '../src/components/au-button';
import { AuCardCustomElement } from '../src/components/au-card';
import { AuInputCustomElement } from '../src/components/au-input';
import { AuProgressCustomElement } from '../src/components/au-progress';
import { AuSwitchCustomElement } from '../src/components/au-switch';

interface TokenSwatch {
    token: string;
    fallback: string;
}

// Fallbacks mirror the light preset in src/themes.ts; the live value comes
// from the --au-cardigan-color-* custom properties set by the theme toolbar.
const brandTokens: TokenSwatch[] = [
    { token: 'primary', fallback: '#0466C8' },
    { token: 'secondary', fallback: '#495057' },
    { token: 'bright', fallback: '#FF6B6B' },
    { token: 'purple', fallback: '#6610F2' },
    { token: 'blueAlt', fallback: '#2744F2' },
    { token: 'skyBlue', fallback: '#ADE8F4' },
];

const feedbackTokens: TokenSwatch[] = [
    { token: 'success', fallback: '#52B788' },
    { token: 'error', fallback: '#DC3545' },
    { token: 'info', fallback: '#00B4D8' },
];

const surfaceTokens: TokenSwatch[] = [
    { token: 'background', fallback: '#FFFFFF' },
    { token: 'surface', fallback: '#F8F9FA' },
    { token: 'text', fallback: '#212529' },
    { token: 'textMuted', fallback: '#6C757D' },
    { token: 'border', fallback: '#CED4DA' },
];

const neutralTokens: TokenSwatch[] = [
    { token: 'light', fallback: '#F8F9FA' },
    { token: 'dark', fallback: '#212529' },
    { token: 'white', fallback: '#FFFFFF' },
    { token: 'lightGrey', fallback: '#CED4DA' },
    { token: 'mediumGrey', fallback: '#495057' },
];

function swatchRow({ token, fallback }: TokenSwatch): string {
    const cssVar = `--au-cardigan-color-${token}`;
    return `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="width: 2.75rem; height: 2rem; flex: none; border-radius: 0.375rem; border: 1px solid var(--au-cardigan-color-border, #CED4DA); background: var(${cssVar}, ${fallback});"></span>
            <span style="display: flex; flex-direction: column; min-width: 0;">
                <span style="font-size: 0.875rem; font-weight: 600; color: var(--au-cardigan-color-text, #212529);">${token}</span>
                <code style="font-size: 0.6875rem; color: var(--au-cardigan-color-textMuted, #6C757D); overflow-wrap: anywhere;">${cssVar}</code>
            </span>
        </div>`;
}

function tokenSection(heading: string, tokens: TokenSwatch[]): string {
    return `
        <section>
            <h3 style="margin: 0 0 0.75rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--au-cardigan-color-textMuted, #6C757D);">${heading}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem 1.5rem;">
                ${tokens.map(swatchRow).join('')}
            </div>
        </section>`;
}

const meta = {
    title: 'Theming/Overview',
};

export default meta;

export const TokenPalette = {
    render: () => ({
        template: `
            <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 880px;">
                <p style="margin: 0; max-width: 60ch; font-size: 0.9375rem; color: var(--au-cardigan-color-textMuted, #6C757D);">
                    Cardigan components read their colours from <code>--au-cardigan-*</code> CSS custom
                    properties. Switch the Theme in the toolbar above to see every token update live.
                </p>
                ${tokenSection('Brand', brandTokens)}
                ${tokenSection('Feedback', feedbackTokens)}
                ${tokenSection('Surface and text', surfaceTokens)}
                ${tokenSection('Neutrals', neutralTokens)}
            </div>`,
    }),
};

export const ComponentSampler = {
    render: () => ({
        components: [
            AuAlertCustomElement,
            AuBadgeCustomElement,
            AuButtonCustomElement,
            AuCardCustomElement,
            AuInputCustomElement,
            AuProgressCustomElement,
            AuSwitchCustomElement,
        ],
        template: `
            <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 560px;">
                <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                    <au-button color="primary">Save changes</au-button>
                    <au-button color="secondary" variant="outline">Preview</au-button>
                    <au-button color="error" variant="ghost">Delete</au-button>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                    <au-badge color="success">Active</au-badge>
                    <au-badge color="info">Beta</au-badge>
                    <au-badge color="error">Overdue</au-badge>
                    <au-badge color="secondary">Archived</au-badge>
                </div>
                <au-alert color="info">Nightly backups run at 02:00 AEST. The last backup finished in 4 minutes.</au-alert>
                <au-card heading="Team storage" subheading="14.4 GB of 20 GB used" variant="outlined">
                    <au-progress value.bind="storageUsed" max.bind="100" color="primary"></au-progress>
                </au-card>
                <au-input
                    label="Workspace name"
                    placeholder="e.g. Aurelia Design"
                    helper="Shown in the sidebar and invite emails"
                    value.bind="workspaceName"></au-input>
                <au-switch
                    label="Email notifications"
                    description="Send a weekly digest of workspace activity"
                    checked.bind="emailNotifications"></au-switch>
            </div>`,
        props: {
            storageUsed: 72,
            workspaceName: 'Cardigan HQ',
            emailNotifications: true,
        },
    }),
};
