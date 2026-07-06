import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-button-group.css';
import template from './au-button-group.html';

@customElement({
    name: 'au-button-group',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuButtonGroupCustomElement implements ICustomElementViewModel {
    @bindable public orientation: 'horizontal' | 'vertical' = 'horizontal';
    @bindable public ariaLabel: string = '';
}
