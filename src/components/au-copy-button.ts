import '../polyfills';
import { resolve } from '@aurelia/kernel';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-copy-button.css';
import template from './au-copy-button.html';

@customElement({
    name: 'au-copy-button',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCopyButtonCustomElement implements ICustomElementViewModel {
    @bindable public value: string = '';
    @bindable public for: string = '';
    @bindable public label: string = 'Copy';
    @bindable public copiedLabel: string = 'Copied!';
    @bindable public resetDelay: number = 2000;
    @bindable public disabled: boolean = false;

    public copied: boolean = false;

    private resetTimer?: ReturnType<typeof setTimeout>;
    private readonly hostElement = resolve(HTMLElement);

    public detaching() {
        this.clearResetTimer();
    }

    public async handleClick() {
        if (this.disabled) {
            return;
        }
        const text = this.resolveText();
        try {
            await this.writeToClipboard(text);
            this.showCopied();
            this.hostElement.dispatchEvent(new CustomEvent('copied', {
                detail: { value: text },
                bubbles: true,
                composed: true
            }));
        } catch (error) {
            this.hostElement.dispatchEvent(new CustomEvent('copy-error', {
                detail: { error },
                bubbles: true,
                composed: true
            }));
        }
    }

    private resolveText(): string {
        if (this.for) {
            const target = this.hostElement.ownerDocument.querySelector(this.for);
            return target?.textContent ?? '';
        }
        return this.value ?? '';
    }

    private async writeToClipboard(text: string) {
        if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(text);
            return;
        }
        const doc = this.hostElement.ownerDocument;
        if (typeof doc.execCommand !== 'function') {
            throw new Error('Clipboard is not available in this environment');
        }
        const textarea = doc.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        doc.body.appendChild(textarea);
        textarea.select();
        let succeeded = false;
        try {
            succeeded = doc.execCommand('copy');
        } finally {
            textarea.remove();
        }
        if (!succeeded) {
            throw new Error('Copy command was rejected');
        }
    }

    private showCopied() {
        this.clearResetTimer();
        this.copied = true;
        const delay = Number(this.resetDelay);
        this.resetTimer = setTimeout(() => {
            this.copied = false;
            this.resetTimer = undefined;
        }, Number.isFinite(delay) && delay >= 0 ? delay : 2000);
    }

    private clearResetTimer() {
        if (this.resetTimer !== undefined) {
            clearTimeout(this.resetTimer);
            this.resetTimer = undefined;
        }
    }
}
