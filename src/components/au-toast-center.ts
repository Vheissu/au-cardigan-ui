import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-toast-center.css';
import template from './au-toast-center.html';
import { AuToastCustomElement } from './au-toast';

export interface ToastOptions {
    id?: string;
    title?: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
    dismissible?: boolean;
    actionLabel?: string;
    action?: (() => void) | null;
    timeout?: number;
}

interface ToastRecord extends Required<Omit<ToastOptions, 'action'>> {
    action: (() => void) | null;
    id: string;
}

let toastSeed = 0;

@customElement({
    name: 'au-toast-center',
    template,
    dependencies: [shadowCSS(SharedStyles, styles), AuToastCustomElement],
    shadowOptions: { mode: 'open' }
})
export class AuToastCenterCustomElement implements ICustomElementViewModel {
    @bindable public position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-right';
    @bindable public limit: number = 4;
    @bindable public autoDismiss: boolean = true;
    @bindable public defaultTimeout: number = 5000;

    public toasts: ToastRecord[] = [];
    private timers = new Map<string, ReturnType<typeof setTimeout>>();
    private readonly hostElement = resolve(HTMLElement);

    public show(toast: ToastOptions): string {
        if (!toast.message) {
            throw new Error('Toast message is required');
        }
        const id = toast.id ?? `toast-${++toastSeed}`;
        const record: ToastRecord = {
            id,
            title: toast.title ?? '',
            message: toast.message,
            type: toast.type ?? 'info',
            dismissible: toast.dismissible !== false,
            actionLabel: toast.actionLabel ?? '',
            action: toast.action ?? null,
            timeout: toast.timeout ?? this.defaultTimeout
        };
        this.toasts = [...this.toasts, record];
        this.enforceLimit();
        this.registerTimer(record);
        return id;
    }

    public dismiss(id: string) {
        this.clearTimer(id);
        const next = this.toasts.filter(toast => toast.id !== id);
        if (next.length !== this.toasts.length) {
            this.toasts = next;
        }
    }

    public clear() {
        this.toasts.forEach(toast => this.clearTimer(toast.id));
        this.toasts = [];
    }

    public handleDismiss(event: CustomEvent<{ id: string }>) {
        const id = event.detail?.id;
        if (id) {
            this.dismiss(id);
        }
    }

    public handleAction(event: CustomEvent<{ id: string }>) {
        const id = event.detail?.id;
        this.hostDispatch('toast-center-action', event.detail);
        if (id) {
            this.dismiss(id);
        }
    }

    private registerTimer(record: ToastRecord) {
        if (!this.autoDismiss) {
            return;
        }
        if (record.timeout === 0) {
            return;
        }
        const handle = setTimeout(() => {
            this.dismiss(record.id);
        }, record.timeout);
        this.timers.set(record.id, handle);
    }

    private clearTimer(id: string) {
        const handle = this.timers.get(id);
        if (handle) {
            clearTimeout(handle);
            this.timers.delete(id);
        }
    }

    private enforceLimit() {
        if (this.limit <= 0) {
            return;
        }
        if (this.toasts.length <= this.limit) {
            return;
        }
        const overflow = this.toasts.length - this.limit;
        const removed = this.toasts.splice(0, overflow);
        removed.forEach(toast => this.clearTimer(toast.id));
        this.toasts = [...this.toasts];
    }

    private hostDispatch(name: string, detail: unknown) {
        const event = new CustomEvent(name, {
            detail,
            bubbles: true,
            composed: true
        });
        this.hostElement.dispatchEvent(event);
    }
}
