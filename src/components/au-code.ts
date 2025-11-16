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
        const codeElement = this.element.shadowRoot.querySelector('code');
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.textContent.trim());
        }
    }
}
