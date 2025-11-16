import '../polyfills';
import { BindingMode } from '@aurelia/runtime-html';
import {
    bindable,
    ICustomElementViewModel,
    customElement,
    shadowCSS,
    children,
} from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-select.css';
import template from './au-select.html';
import { resolve } from '@aurelia/kernel';

@customElement({
    name: 'au-select',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' },
})
export class AuSelectCustomElement implements ICustomElementViewModel {
    @bindable public size: 'small' | 'medium' | 'large' = 'medium';
    @bindable public disabled: boolean = false;
    @bindable({ mode: BindingMode.twoWay }) public value: unknown;
    @bindable public placeholder: string = 'Select an option';
    @bindable public options: Array<{ value: string; label: string }> = [];
    @bindable public name: string = '';
    @bindable public required: boolean = false;
    @bindable public multiple: boolean = false;

    private element = resolve(Element);

    @children('option')
    public slottedOptions!: HTMLOptionElement[];

    private get allOptions(): Array<
        HTMLOptionElement | { value: string; label: string }
    > {
        return [...this.slottedOptions, ...this.options];
    }

    valueChanged(newValue: unknown) {
        this.updateSelectValue(newValue);
    }

    private updateSelectValue(value: unknown) {
        const select = this.element.shadowRoot?.querySelector(
            'select'
        ) as HTMLSelectElement;
        if (select && value != null) {
            select.value = value as string;
        }
    }

    attached() {
        this.updateSelectValue(this.value);
    }
}
