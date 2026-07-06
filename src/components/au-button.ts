import '../polyfills';
import { bindable, ICustomElementViewModel, customElement, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-button.css';
import template from './au-button.html';

@customElement({
    name: 'au-button',
    template,
    dependencies: [
        shadowCSS(SharedStyles, styles)
    ],
    shadowOptions: { mode: 'open' }
})
export class AuButtonCustomElement implements ICustomElementViewModel {
    @bindable public disabled: boolean = false;
    @bindable public loading: boolean = false;
    @bindable public color = '';
    @bindable public variant: 'solid' | 'outline' | 'ghost' = 'solid';
    @bindable public fullWidth: boolean = false;
    @bindable public icon = null;
    @bindable public iconSize = '1rem';
    @bindable public size = 'medium';
    @bindable public title: string = '';
    @bindable public type: string = 'button';
    @bindable public content: string = '';
    @bindable public callback: (() => unknown) | null = null;

    private readonly hostElement = resolve(HTMLElement);

    public get isDisabled(): boolean {
        return this.disabled || this.loading;
    }

    public innerCallback() {
        if (this.isDisabled) {
            return;
        }
        if (this.callback) {
            this.callback();
        }
        this.hostElement.dispatchEvent(new CustomEvent('au-button-click', {
            bubbles: true,
            composed: true
        }));
    }
}
