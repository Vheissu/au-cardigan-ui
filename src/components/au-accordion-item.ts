import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-accordion-item.css';
import template from './au-accordion-item.html';

let accordionItemSeed = 0;

@customElement({
    name: 'au-accordion-item',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuAccordionItemCustomElement implements ICustomElementViewModel {
    @bindable public itemId: string = '';
    @bindable public heading: string = '';
    @bindable public description: string = '';
    @bindable public open: boolean = false;
    @bindable public disabled: boolean = false;
    @bindable public lazy: boolean = false;

    public headingProjected = false;
    private readonly host = resolve(HTMLElement);
    private readonly generatedId = `au-accordion-item-${++accordionItemSeed}`;

    public get itemUid() {
        return this.itemId || this.generatedId;
    }

    public get panelId() {
        return `${this.itemUid}-panel`;
    }

    public get buttonId() {
        return `${this.itemUid}-button`;
    }

    public get shouldRenderContent() {
        return !this.lazy || this.open;
    }

    public requestToggle() {
        const event = new CustomEvent('accordion-item-request', {
            detail: { item: this },
            bubbles: true,
            composed: true
        });
        this.host.dispatchEvent(event);
    }

    public handleHeadingSlot(event: Event) {
        this.headingProjected = this.slotHasContent(event.target as HTMLSlotElement | null);
    }

    private slotHasContent(slot: HTMLSlotElement | null) {
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
}
