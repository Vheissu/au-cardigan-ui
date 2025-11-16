import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-input.css';
import template from './au-input.html';

let inputId = 0;

@customElement({
    name: 'au-input',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuInputCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay })
    public value: string | number | null = '';
    @bindable public type: string = 'text';
    @bindable public placeholder: string = '';
    @bindable public label: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public name: string = '';
    @bindable public autocomplete: string = '';
    @bindable public disabled: boolean = false;
    @bindable public readonly: boolean = false;
    @bindable public required: boolean = false;
    @bindable public size: 'small' | 'medium' | 'large' = 'medium';
    @bindable public inputmode: string = '';
    @bindable public id: string = '';
    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-input-${++inputId}`;

    public get controlId() {
        return this.id || this.generatedId;
    }

    public get helperId() {
        return this.helper ? `${this.controlId}-helper` : '';
    }

    public get errorId() {
        return this.error ? `${this.controlId}-error` : '';
    }

    public get describedBy() {
        const ids: string[] = [];
        if (this.errorId) {
            ids.push(this.errorId);
        }
        if (this.helperId) {
            ids.push(this.helperId);
        }
        return ids.length ? ids.join(' ') : null;
    }

    public bound() {
        this.updateNativeValue();
    }

    public attached() {
        this.updateNativeValue();
    }

    public valueChanged() {
        this.updateNativeValue();
    }

    public handleInput(event: Event) {
        const target = event.target as HTMLInputElement | null;
        this.value = target?.value ?? '';
    }

    private updateNativeValue() {
        const input = this.hostElement.shadowRoot?.querySelector('input') as HTMLInputElement | undefined;
        const nextValue = this.value ?? '';
        if (input && input.value !== String(nextValue)) {
            input.value = String(nextValue);
        }
    }
}
