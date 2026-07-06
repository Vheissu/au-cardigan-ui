import '../polyfills';
import { bindable, children, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-breadcrumb.css';
import template from './au-breadcrumb.html';
import { AuBreadcrumbItemCustomElement } from './au-breadcrumb-item';

@customElement({
    name: 'au-breadcrumb',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuBreadcrumbCustomElement implements ICustomElementViewModel {
    @bindable public separator: string = '/';
    @bindable public ariaLabel: string = 'breadcrumb';

    @children('au-breadcrumb-item')
    public items: AuBreadcrumbItemCustomElement[] = [];

    public attached() {
        this.syncItems();
    }

    public itemsChanged() {
        this.syncItems();
    }

    public separatorChanged() {
        this.syncItems();
    }

    private syncItems() {
        const items = this.items ?? [];
        items.forEach((item, index) => {
            item.separator = this.separator;
            item.last = index === items.length - 1;
        });
    }
}
