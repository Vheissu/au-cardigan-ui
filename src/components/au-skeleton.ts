import '../polyfills';
import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';

import SharedStyles from '../variables.css';

import styles from './au-skeleton.css';
import template from './au-skeleton.html';

@customElement({
    name: 'au-skeleton',
    template,
    dependencies: [shadowCSS(SharedStyles, styles)],
    shadowOptions: { mode: 'open' }
})
export class AuSkeletonCustomElement implements ICustomElementViewModel {
    @bindable public shape: 'text' | 'circle' | 'rect' | 'avatar' = 'text';
    @bindable public width: string = '100%';
    @bindable public height: string = '1rem';
    @bindable public lines: number = 1;
    @bindable public animated: boolean = true;
    @bindable public radius: string = '0.5rem';
    @bindable public ariaLabel: string = 'Loading placeholder';

    public lineIndexes: number[] = [];

    binding() {
        this.syncLines();
    }

    linesChanged() {
        this.syncLines();
    }

    private syncLines() {
        const count = Math.max(1, Number(this.lines) || 1);
        this.lineIndexes = Array.from({ length: count }, (_, index) => index);
    }

    public getLineWidth(index: number): string {
        if (this.shape !== 'text') {
            return this.width;
        }
        if (index === this.lineIndexes.length - 1) {
            return this.width === '100%' ? '70%' : this.width;
        }
        return this.width;
    }
}
