import { customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-divider.css';
import template from './au-divider.html';

@customElement({
  name: 'au-divider',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuDividerCustomElement implements ICustomElementViewModel {}
