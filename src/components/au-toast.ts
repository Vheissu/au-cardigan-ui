import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-toast.css';
import template from './au-toast.html';

@customElement({
    name: 'au-toast',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuToastCustomElement implements ICustomElementViewModel {
    @bindable public toastId: string = '';
    @bindable public type: 'info' | 'success' | 'warning' | 'danger' | 'neutral' = 'info';
    @bindable public title: string = '';
    @bindable public message: string = '';
    @bindable public dismissible: boolean = true;
    @bindable public actionLabel: string = '';
    @bindable public actionCallback: (() => void) | null = null;

    private readonly host = resolve(HTMLElement);

    public dismiss() {
        const event = new CustomEvent('toast-dismiss', {
            detail: { id: this.toastId },
            bubbles: true,
            composed: true
        });
        this.host.dispatchEvent(event);
    }

    public handleAction() {
        this.actionCallback?.();
        const event = new CustomEvent('toast-action', {
            detail: { id: this.toastId },
            bubbles: true,
            composed: true
        });
        this.host.dispatchEvent(event);
    }
}
