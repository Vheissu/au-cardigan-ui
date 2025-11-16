import '../polyfills';
import {
    bindable,
    ICustomElementViewModel,
    customElement,
    shadowCSS,
} from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-code.css';
import template from './au-code.html';
import { resolve } from '@aurelia/kernel';
@customElement({
    name: 'au-code',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' },
})
export class AuCodeCustomElement implements ICustomElementViewModel {
    @bindable public type: 'pre' | 'code' = 'pre';
    @bindable public language: string = '';
    @bindable public copyable: boolean = false;

    private element: HTMLElement = resolve(HTMLElement);

    private copyText(): void {
        const slot = this.element.shadowRoot?.querySelector('slot');
        const content = slot
            ? slot
                .assignedNodes()
                .map(node => node.textContent)
                .join('')
                .trim()
            : '';
        navigator.clipboard.writeText(content);
    }
}
