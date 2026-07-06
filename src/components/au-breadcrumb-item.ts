import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-breadcrumb-item.css';
import template from './au-breadcrumb-item.html';

@customElement({
    name: 'au-breadcrumb-item',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuBreadcrumbItemCustomElement implements ICustomElementViewModel {
    @bindable public href: string = '';
    @bindable public current: boolean = false;

    /**
     * Managed by the parent au-breadcrumb: the separator character rendered
     * after this item and whether this item is the last one in the trail.
     */
    public separator: string = '/';
    public last: boolean = false;

    public get ariaCurrent(): 'page' | null {
        return this.current || this.last ? 'page' : null;
    }
}
