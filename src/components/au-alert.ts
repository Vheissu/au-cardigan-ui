import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-alert.css';
import template from './au-alert.html';

@customElement({
  name: 'au-alert',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuAlertCustomElement implements ICustomElementViewModel {
  @bindable public type: 'primary' | 'success' | 'info' | 'error' | 'warning' = 'info';
  @bindable public dismissible: boolean = false;
  public closed = false;

  public close() {
    this.closed = true;
  }
}
