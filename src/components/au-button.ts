import { bindable, ICustomElementViewModel, customElement } from '@aurelia/runtime';

import styles from './au-button.css';
import template from './au-button.html';

@customElement({
    name: 'au-button',
    template
})
export class AuButtonCustomElement implements ICustomElementViewModel<Element> {
    @bindable public disabled: boolean = false;
    @bindable public color = 'primary';
    @bindable public icon = null;
    @bindable public iconSize = '1rem';
    @bindable public size = 'medium';
    @bindable public title: string = '';
    @bindable public type: string = 'button';
    @bindable public callback: any = () => ``;

    private styles = styles;

    public innerCallback() {
        if (this.callback) {
            this.callback();
        }
    }
}