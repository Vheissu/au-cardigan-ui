import '../polyfills';
import { bindable, children, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-tabs.css';
import template from './au-tabs.html';
import { AuTabPanelCustomElement } from './au-tab-panel';

@customElement({
    name: 'au-tabs',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuTabsCustomElement implements ICustomElementViewModel {
    @bindable public orientation: 'horizontal' | 'vertical' = 'horizontal';
    @bindable public activation: 'auto' | 'manual' = 'auto';
    @bindable public variant: 'default' | 'pill' | 'underline' | 'soft' = 'default';
    @bindable public stretch: boolean = false;
    @bindable public activeId: string = '';

    @children('au-tab-panel')
    public panels: AuTabPanelCustomElement[] = [];

    private readonly host = resolve(HTMLElement);
    private typeBuffer = '';
    private typeTimeout: ReturnType<typeof setTimeout> | null = null;
    private activeIndex = -1;
    private syncing = false;

    bound() {
        this.queuePanelSync();
    }

    attached() {
        this.queuePanelSync();
    }

    panelsChanged() {
        this.queuePanelSync();
    }

    activeIdChanged() {
        this.queuePanelSync();
    }

    private queuePanelSync() {
        if (this.syncing) {
            return;
        }
        this.syncing = true;
        queueMicrotask(() => {
            this.updatePanels();
            this.syncing = false;
        });
    }

    private updatePanels() {
        const collection = this.panels ?? [];
        if (!collection.length) {
            this.activeIndex = -1;
            return;
        }

        const enabledPanels = collection.filter(panel => !panel.disabled);
        if (!enabledPanels.length) {
            if (this.activeId) {
                this.activeId = '';
            }
            this.activeIndex = -1;
            collection.forEach(panel => panel.active = false);
            return;
        }

        const hasCurrent = collection.some(panel => panel.panelUid === this.activeId && !panel.disabled);
        const nextActiveId = hasCurrent ? this.activeId : enabledPanels[0].panelUid;
        if (!hasCurrent && this.activeId !== nextActiveId) {
            this.activeId = nextActiveId;
        }
        this.activeIndex = -1;

        collection.forEach((panel, index) => {
            panel.tabId = `${panel.panelUid}-tab`;
            const isActive = panel.panelUid === nextActiveId;
            panel.active = isActive;
            if (isActive) {
                this.activeIndex = index;
            }
        });
    }

    public activatePanel(panel: AuTabPanelCustomElement, options: { focus?: boolean } = {}) {
        if (!panel || panel.disabled) {
            return;
        }
        this.activeId = panel.panelUid;
        this.updatePanels();
        const shouldFocus = options.focus ?? true;
        if (shouldFocus) {
            this.focusTabById(panel.panelUid);
        }
    }

    public handleKeydown(event: KeyboardEvent, index: number) {
        const key = event.key;
        const isHorizontal = this.orientation === 'horizontal';
        let handled = false;
        if ((key === 'ArrowRight' && isHorizontal) || (key === 'ArrowDown' && !isHorizontal)) {
            this.moveFocus(index, 1);
            handled = true;
        } else if ((key === 'ArrowLeft' && isHorizontal) || (key === 'ArrowUp' && !isHorizontal)) {
            this.moveFocus(index, -1);
            handled = true;
        } else if (key === 'Home') {
            this.focusEdge('start');
            handled = true;
        } else if (key === 'End') {
            this.focusEdge('end');
            handled = true;
        } else if (key === 'Enter' || key === ' ') {
            const panel = this.panels?.[index];
            if (panel && !panel.disabled) {
                this.activatePanel(panel);
            }
            handled = true;
        } else if (key && key.length === 1 && !event.metaKey && !event.ctrlKey) {
            this.handleTypeahead(key);
        }

        if (handled) {
            event.preventDefault();
        }
    }

    private moveFocus(currentIndex: number, delta: number) {
        const list = this.panels ?? [];
        if (!list.length) {
            return;
        }
        let steps = list.length;
        let index = currentIndex;
        while (steps > 0) {
            index = (index + delta + list.length) % list.length;
            const panel = list[index];
            if (panel && !panel.disabled) {
                this.focusPanel(panel, true);
                return;
            }
            steps--;
        }
    }

    private focusEdge(position: 'start' | 'end') {
        const list = this.panels ?? [];
        const iterable = position === 'start' ? list : [...list].reverse();
        const target = iterable.find(panel => !panel.disabled);
        if (target) {
            this.focusPanel(target, true);
        }
    }

    private focusPanel(panel: AuTabPanelCustomElement, viaKeyboard: boolean) {
        if (this.activation === 'auto' && viaKeyboard) {
            this.activatePanel(panel);
        } else {
            this.focusTabById(panel.panelUid);
        }
    }

    private focusTabById(id: string) {
        const selector = `[data-tab-id="${id}"]`;
        const button = this.host.shadowRoot?.querySelector(selector) as HTMLButtonElement | null;
        button?.focus();
    }

    private handleTypeahead(key: string) {
        this.typeBuffer += key.toLowerCase();
        if (this.typeTimeout) {
            clearTimeout(this.typeTimeout);
        }
        this.typeTimeout = setTimeout(() => {
            this.typeBuffer = '';
        }, 500);

        const list = this.panels ?? [];
        const descriptors = list.map((panel, idx) => ({ panel, label: this.getPanelLabel(panel, idx).toLowerCase() }));
        const active = this.activeIndex >= 0 ? this.activeIndex : 0;
        const searchSpace = [...descriptors.slice(active + 1), ...descriptors.slice(0, active + 1)];
        const match = searchSpace.find(item => !item.panel.disabled && item.label.startsWith(this.typeBuffer));
        if (match) {
            this.activatePanel(match.panel);
        }
    }

    public getPanelLabel(panel: AuTabPanelCustomElement, index: number) {
        return panel.label || `Tab ${index + 1}`;
    }


    public onTabClick(panel: AuTabPanelCustomElement) {
        this.activatePanel(panel, { focus: false });
    }
}
