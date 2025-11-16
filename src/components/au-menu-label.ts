import { customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-menu-label.css';
import template from './au-menu-label.html';

@customElement({
  name: 'au-menu-label',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuMenuLabelCustomElement implements ICustomElementViewModel {
}
