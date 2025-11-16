import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-tab-panel.css';
import template from './au-tab-panel.html';

let panelSeed = 0;

@customElement({
    name: 'au-tab-panel',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuTabPanelCustomElement implements ICustomElementViewModel {
    @bindable public panelId: string = '';
    @bindable public label: string = '';
    @bindable public icon: string = '';
    @bindable public disabled: boolean = false;
    @bindable public lazy: boolean = false;
    @bindable public active: boolean = false;

    public tabId: string = '';
    private readonly generatedId = `au-tab-panel-${++panelSeed}`;

    public get panelUid() {
        return this.panelId || this.generatedId;
    }

    public get showContent() {
        return !this.lazy || this.active;
    }
}
