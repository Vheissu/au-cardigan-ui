import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-card.css';
import template from './au-card.html';

@customElement({
    name: 'au-card',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCardCustomElement implements ICustomElementViewModel {
    @bindable public variant: 'elevated' | 'outlined' | 'subtle' = 'elevated';
    @bindable public padding: 'none' | 'compact' | 'comfortable' | 'spacious' = 'comfortable';
    @bindable public interactive: boolean = false;
    @bindable public heading: string = '';
    @bindable public subheading: string = '';
    @bindable public mediaAlign: 'top' | 'start' | 'end' = 'top';
    @bindable public role: string = 'group';

    public headerProjected = false;
    public footerProjected = false;
    public mediaProjected = false;

    public get shouldShowHeader(): boolean {
        return this.headerProjected || !!this.heading || !!this.subheading;
    }

    public get shouldShowFooter(): boolean {
        return this.footerProjected;
    }

    public get shouldShowMedia(): boolean {
        return this.mediaProjected;
    }

    public handleHeaderSlot(event: Event) {
        this.headerProjected = this.slotHasContent(event.target as HTMLSlotElement | null);
    }

    public handleFooterSlot(event: Event) {
        this.footerProjected = this.slotHasContent(event.target as HTMLSlotElement | null);
    }

    public handleMediaSlot(event: Event) {
        this.mediaProjected = this.slotHasContent(event.target as HTMLSlotElement | null);
    }

    private slotHasContent(slot: HTMLSlotElement | null): boolean {
        if (!slot) {
            return false;
        }
        const nodes = slot.assignedNodes({ flatten: true });
        return nodes.some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                return true;
            }
            return Boolean(node.textContent && node.textContent.trim().length);
        });
    }

    public get tabIndex() {
        return this.interactive ? 0 : null;
    }

    public get cardRole() {
        return this.role || (this.interactive ? 'button' : 'group');
    }
}
