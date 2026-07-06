import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { BindingMode, bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-combobox.css';
import template from './au-combobox.html';

let comboboxId = 0;

export type ComboboxOption = string | { value: string; label: string };

interface NormalizedOption {
    value: string;
    label: string;
}

@customElement({
    name: 'au-combobox',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuComboboxCustomElement implements ICustomElementViewModel {
    @bindable public options: ComboboxOption[] = [];
    @bindable({ mode: BindingMode.twoWay }) public value: string = '';
    @bindable public placeholder: string = '';
    @bindable public label: string = '';
    @bindable public helper: string = '';
    @bindable public error: string = '';
    @bindable public disabled: boolean = false;
    @bindable public freeText: boolean = false;
    @bindable public noResultsText: string = 'No results';

    public inputText: string = '';
    public open: boolean = false;
    public highlightedIndex: number = -1;

    private readonly hostElement = resolve(HTMLElement);
    private readonly generatedId = `au-combobox-${++comboboxId}`;
    private readonly boundDocumentClick = (event: MouseEvent) => this.handleDocumentClick(event);

    public get controlId() {
        return this.generatedId;
    }

    public get listboxId() {
        return `${this.controlId}-listbox`;
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

    public get activeDescendant() {
        return this.open && this.highlightedIndex >= 0
            ? `${this.controlId}-option-${this.highlightedIndex}`
            : null;
    }

    public get normalizedOptions(): NormalizedOption[] {
        return (this.options ?? []).map(option => typeof option === 'string'
            ? { value: option, label: option }
            : { value: option.value, label: option.label ?? option.value });
    }

    public get filteredOptions(): NormalizedOption[] {
        const query = this.inputText.trim().toLowerCase();
        const all = this.normalizedOptions;
        if (!query) {
            return all;
        }
        return all.filter(option => option.label.toLowerCase().includes(query));
    }

    public bound() {
        this.syncInputTextFromValue();
    }

    public attached() {
        this.hostElement.ownerDocument.addEventListener('click', this.boundDocumentClick);
    }

    public detaching() {
        this.hostElement.ownerDocument.removeEventListener('click', this.boundDocumentClick);
    }

    public valueChanged() {
        this.syncInputTextFromValue();
    }

    public handleInput(event: Event) {
        if (this.disabled) {
            return;
        }
        const target = event.target as HTMLInputElement | null;
        this.inputText = target?.value ?? '';
        this.open = true;
        this.highlightedIndex = this.filteredOptions.length ? 0 : -1;
    }

    public handleKeydown(event: KeyboardEvent) {
        if (this.disabled) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!this.open) {
                    this.openList();
                } else if (this.filteredOptions.length) {
                    this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredOptions.length - 1);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (this.open && this.filteredOptions.length) {
                    this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
                }
                break;
            case 'Enter': {
                const highlighted = this.open && this.highlightedIndex >= 0
                    ? this.filteredOptions[this.highlightedIndex]
                    : undefined;
                if (highlighted) {
                    event.preventDefault();
                    this.selectOption(highlighted);
                } else if (this.freeText && this.inputText.trim()) {
                    event.preventDefault();
                    this.commitFreeText();
                }
                break;
            }
            case 'Escape':
                if (this.open) {
                    event.preventDefault();
                    this.closeList();
                }
                break;
        }
    }

    public handleOptionMouseDown(event: Event) {
        event.preventDefault();
    }

    public handleBlur() {
        if (this.freeText) {
            const text = this.inputText.trim();
            const selectedLabel = this.labelForValue(this.value);
            if (text && text !== selectedLabel) {
                this.commitFreeText();
            }
        } else {
            this.syncInputTextFromValue();
        }
        this.closeList();
    }

    public selectOption(option: NormalizedOption) {
        if (this.disabled) {
            return;
        }
        this.value = option.value;
        this.inputText = option.label;
        this.closeList();
        this.dispatchChange();
    }

    private openList() {
        this.open = true;
        const filtered = this.filteredOptions;
        const selectedIndex = filtered.findIndex(option => option.value === this.value);
        this.highlightedIndex = selectedIndex >= 0 ? selectedIndex : (filtered.length ? 0 : -1);
    }

    private closeList() {
        this.open = false;
        this.highlightedIndex = -1;
    }

    private commitFreeText() {
        const text = this.inputText.trim();
        const match = this.normalizedOptions.find(option => option.label.toLowerCase() === text.toLowerCase());
        if (match) {
            this.selectOption(match);
            return;
        }
        this.value = text;
        this.inputText = text;
        this.closeList();
        this.dispatchChange();
    }

    private handleDocumentClick(event: MouseEvent) {
        if (this.open && !this.hostElement.contains(event.target as Node)) {
            this.closeList();
        }
    }

    private syncInputTextFromValue() {
        const match = this.normalizedOptions.find(option => option.value === this.value);
        this.inputText = match ? match.label : (this.value ?? '');
    }

    private labelForValue(value: string) {
        const match = this.normalizedOptions.find(option => option.value === value);
        return match ? match.label : (value ?? '');
    }

    private dispatchChange() {
        this.hostElement.dispatchEvent(new CustomEvent('change', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
    }
}
