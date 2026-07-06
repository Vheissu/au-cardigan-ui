import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-checkbox.css';
import template from './au-checkbox.html';

let checkboxId = 0;

@customElement({
    name: 'au-checkbox',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCheckboxCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) public checked: boolean = false;
    @bindable public value: string = 'on';
    @bindable public label: string = '';
    @bindable public description: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public name: string = '';
    @bindable public disabled: boolean = false;
    @bindable public required: boolean = false;
    @bindable public indeterminate: boolean = false;
    @bindable public id: string = '';

    private checkboxElement?: HTMLInputElement;
    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-checkbox-${++checkboxId}`;

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

    public attached() {
        this.syncIndeterminate();
        this.syncChecked();
    }

    public indeterminateChanged() {
        this.syncIndeterminate();
    }

    public checkedChanged() {
        this.syncChecked();
    }

    public handleChange(event: Event) {
        const target = event.target as HTMLInputElement | null;
        this.checked = !!target?.checked;
        this.hostElement.dispatchEvent(new CustomEvent('au-checkbox-change', {
            detail: { checked: this.checked, value: this.value },
            bubbles: true,
            composed: true
        }));
    }

    private syncIndeterminate() {
        if (this.checkboxElement) {
            this.checkboxElement.indeterminate = !!this.indeterminate;
        }
    }

    private syncChecked() {
        if (this.checkboxElement) {
            this.checkboxElement.checked = !!this.checked;
        }
    }
}
