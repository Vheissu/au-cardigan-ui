import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-color-picker.css';
import template from './au-color-picker.html';

let colorPickerId = 0;

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const DEFAULT_SWATCHES = [
    '#0466C8',
    '#495057',
    '#FF6B6B',
    '#6610F2',
    '#52B788',
    '#DC3545',
    '#00B4D8',
    '#ADE8F4'
];

@customElement({
    name: 'au-color-picker',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuColorPickerCustomElement implements ICustomElementViewModel {
    @bindable({ mode: BindingMode.twoWay }) public value: string = '#0466C8';
    @bindable public label: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public disabled: boolean = false;
    @bindable public swatches: string[] = [...DEFAULT_SWATCHES];
    @bindable public showInput: boolean = true;

    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-color-picker-${++colorPickerId}`;

    public get controlId() {
        return this.generatedId;
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

    public handleColorChange(event: Event) {
        const target = event.target as HTMLInputElement | null;
        const next = target?.value ?? '';
        if (HEX_PATTERN.test(next)) {
            this.setValue(next);
        }
    }

    public handleHexChange(event: Event) {
        const target = event.target as HTMLInputElement | null;
        const raw = (target?.value ?? '').trim();
        if (HEX_PATTERN.test(raw)) {
            this.setValue(raw);
        } else if (target) {
            target.value = this.value ?? '';
        }
    }

    public selectSwatch(swatch: string) {
        this.setValue(swatch);
    }

    private setValue(next: string) {
        if (this.disabled) {
            return;
        }
        const changed = this.value !== next;
        this.value = next;
        if (changed) {
            this.hostElement.dispatchEvent(new CustomEvent('change', {
                detail: { value: next },
                bubbles: true,
                composed: true
            }));
        }
    }
}
