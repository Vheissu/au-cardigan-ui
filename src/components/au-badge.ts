import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-badge.css';
import template from './au-badge.html';

@customElement({
  name: 'au-badge',
  template,
  dependencies: [
    shadowCSS(SharedStyles, styles)
  ],
  shadowOptions: { mode: 'open' }
})
export class AuBadgeCustomElement implements ICustomElementViewModel {
  @bindable public color: string = 'primary';
  @bindable public size: 'small' | 'medium' | 'large' = 'medium';
}
