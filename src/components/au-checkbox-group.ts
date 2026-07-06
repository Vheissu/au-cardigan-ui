import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, children, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-checkbox-group.css';
import template from './au-checkbox-group.html';
import { AuCheckboxCustomElement } from './au-checkbox';

let checkboxGroupId = 0;

@customElement({
    name: 'au-checkbox-group',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCheckboxGroupCustomElement implements ICustomElementViewModel {
    @bindable public label: string = '';
    @bindable public orientation: 'vertical' | 'horizontal' = 'vertical';
    @bindable({ mode: BindingMode.twoWay }) public value: string[] = [];
    @bindable public disabled: boolean = false;
    @bindable public helper: string = '';
    @bindable public error: string = '';

    @children('au-checkbox')
    public checkboxes: AuCheckboxCustomElement[] = [];

    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-checkbox-group-${++checkboxGroupId}`;
    private syncingFromChildren = false;
    private readonly boundChildChange = (event: Event) => this.handleChildChange(event as CustomEvent<{ checked: boolean; value: string }>);

    public get helperId() {
        return this.helper ? `${this.generatedId}-helper` : '';
    }

    public get errorId() {
        return this.error ? `${this.generatedId}-error` : '';
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
        this.hostElement.addEventListener('au-checkbox-change', this.boundChildChange);
    }

    public detaching() {
        this.hostElement.removeEventListener('au-checkbox-change', this.boundChildChange);
    }

    public attached() {
        if (this.disabled) {
            this.applyDisabledToItems();
        }
        this.applyValueToItems();
    }

    public checkboxesChanged() {
        if (this.disabled) {
            this.applyDisabledToItems();
        }
        this.applyValueToItems();
    }

    public valueChanged() {
        if (!this.syncingFromChildren) {
            this.applyValueToItems();
        }
    }

    public disabledChanged() {
        this.applyDisabledToItems();
    }

    private handleChildChange(event: CustomEvent<{ checked: boolean; value: string }>) {
        event.stopPropagation();
        const next = (this.checkboxes ?? []).filter(item => item.checked).map(item => item.value);
        this.syncingFromChildren = true;
        this.value = next;
        this.syncingFromChildren = false;
        this.hostElement.dispatchEvent(new CustomEvent('change', {
            detail: { value: next },
            bubbles: true,
            composed: true
        }));
    }

    private applyValueToItems() {
        const selected = this.value ?? [];
        (this.checkboxes ?? []).forEach(item => {
            const desired = selected.includes(item.value);
            if (item.checked !== desired) {
                item.checked = desired;
            }
        });
    }

    private applyDisabledToItems() {
        (this.checkboxes ?? []).forEach(item => {
            item.disabled = !!this.disabled;
        });
    }
}
