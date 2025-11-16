import '../polyfills';
import { bindable, children, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-accordion.css';
import template from './au-accordion.html';
import { AuAccordionItemCustomElement } from './au-accordion-item';

@customElement({
    name: 'au-accordion',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuAccordionCustomElement implements ICustomElementViewModel {
    @bindable public multiple: boolean = false;
    @bindable public collapsible: boolean = true;
    @bindable public variant: 'default' | 'bordered' | 'contained' = 'default';

    @children('au-accordion-item')
    public items: AuAccordionItemCustomElement[] = [];

    private readonly hostElement = resolve(HTMLElement);
    private readonly boundToggle = (event: Event) => this.handleToggleRequest(event as CustomEvent<{ item: AuAccordionItemCustomElement }>);

    binding() {
        this.hostElement.addEventListener('accordion-item-request', this.boundToggle);
    }

    detaching() {
        this.hostElement.removeEventListener('accordion-item-request', this.boundToggle);
    }

    public handleToggleRequest(event: CustomEvent<{ item: AuAccordionItemCustomElement }>) {
        event.stopPropagation();
        const item = event.detail?.item;
        if (!item || item.disabled) {
            return;
        }
        const nextState = !item.open;
        if (!this.collapsible && item.open && !nextState) {
            const openItems = (this.items ?? []).filter(entry => entry.open);
            if (openItems.length <= 1) {
                return;
            }
        }

        if (!this.multiple && nextState) {
            (this.items ?? []).forEach(entry => {
                if (entry !== item) {
                    entry.open = false;
                }
            });
        }

        item.open = nextState;
    }
}
