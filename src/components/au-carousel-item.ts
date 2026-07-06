import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import { resolve } from '@aurelia/kernel';

import SharedStyles from '../variables.css';

import styles from './au-carousel-item.css';
import template from './au-carousel-item.html';

@customElement({
    name: 'au-carousel-item',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuCarouselItemCustomElement implements ICustomElementViewModel {
    @bindable public label: string = '';

    public active: boolean = false;

    private readonly host = resolve(HTMLElement);

    public applyState(index: number, total: number, active: boolean) {
        this.active = active;
        this.host.setAttribute('role', 'group');
        this.host.setAttribute('aria-roledescription', 'slide');
        this.host.setAttribute('aria-label', this.label || `${index + 1} of ${total}`);
        this.host.setAttribute('aria-hidden', active ? 'false' : 'true');
        this.host.classList.toggle('is-active', active);
    }
}
