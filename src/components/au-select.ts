import { bindable, ICustomElementViewModel, customElement, BindingMode } from '@aurelia/runtime';
import { shadowCSS, cssModules } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-select.css';
import template from './au-select.html';
@customElement({
    name: 'au-select',
    template,
    dependencies: [
        shadowCSS(SharedStyles, styles)
    ],
    shadowOptions: { mode: 'open' }
})
export class AuSelectCustomElement implements ICustomElementViewModel<Element> {
    @bindable public size: 'small' | 'medium' | 'largeg' = 'medium';
    @bindable public disabled: boolean = false;
    @bindable({ mode: BindingMode.twoWay }) public value: unknown;
}