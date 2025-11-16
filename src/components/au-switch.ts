import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-switch.css';
import template from './au-switch.html';

let switchId = 0;

@customElement({
    name: 'au-switch',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuSwitchCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) public checked: boolean = false;
    @bindable public label: string = '';
    @bindable public description: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public name: string = '';
    @bindable public disabled: boolean = false;
    @bindable public required: boolean = false;
    @bindable public size: 'small' | 'medium' | 'large' = 'medium';
    @bindable public id: string = '';

    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-switch-${++switchId}`;

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

    public binding() {
        this.syncChecked();
    }

    public checkedChanged() {
        this.syncChecked();
    }

    public handleChange(event: Event) {
        const target = event.target as HTMLInputElement | null;
        this.checked = !!target?.checked;
    }

    private syncChecked() {
        const input = this.hostElement.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement | undefined;
        if (input) {
            input.checked = !!this.checked;
        }
    }
}
