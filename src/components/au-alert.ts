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
  @bindable public color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'light' | 'dark' = 'primary';
  @bindable public dismissible: boolean = false;

  public visible = true;

  public dismiss() {
    this.visible = false;
  }
}
