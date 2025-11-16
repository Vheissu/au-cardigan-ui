import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-textarea.css';
import template from './au-textarea.html';

let textareaId = 0;

@customElement({
    name: 'au-textarea',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuTextareaCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay })
    public value: string | null = '';
    @bindable public placeholder: string = '';
    @bindable public label: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public name: string = '';
    @bindable public disabled: boolean = false;
    @bindable public readonly: boolean = false;
    @bindable public required: boolean = false;
    @bindable public rows: number = 3;
    @bindable public resize: 'vertical' | 'horizontal' | 'both' | 'none' = 'vertical';
    @bindable public maxlength?: number;
    @bindable public minlength?: number;
    @bindable public id: string = '';
    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-textarea-${++textareaId}`;

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
        const target = event.target as HTMLTextAreaElement | null;
        this.value = target?.value ?? '';
    }

    private updateNativeValue() {
        const textarea = this.hostElement.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | undefined;
        const nextValue = this.value ?? '';
        if (textarea && textarea.value !== nextValue) {
            textarea.value = nextValue;
        }
    }
}
