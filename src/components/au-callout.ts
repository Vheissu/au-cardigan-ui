import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-callout.css';
import template from './au-callout.html';

@customElement({
    name: 'au-callout',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCalloutCustomElement implements ICustomElementViewModel {
    @bindable public variant: 'info' | 'success' | 'warning' | 'error' | 'neutral' = 'info';
    @bindable public heading: string = '';
    @bindable public dismissible: boolean = false;

    public visible = true;

    private readonly hostElement = resolve(HTMLElement);

    public dismiss() {
        if (!this.visible) {
            return;
        }
        this.visible = false;
        this.hostElement.dispatchEvent(new CustomEvent('dismissed', {
            bubbles: true,
            composed: true
        }));
    }
}
