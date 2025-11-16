import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-spinner.css';
import template from './au-spinner.html';

@customElement({
    name: 'au-spinner',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuSpinnerCustomElement implements ICustomElementViewModel {
    @bindable public size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @bindable public variant: 'primary' | 'secondary' | 'inverted' | 'success' | 'danger' = 'primary';
    @bindable public label: string = 'Loading';
    @bindable public paused: boolean = false;

    public get ariaLabel() {
        return this.label || 'Loading';
    }
}
