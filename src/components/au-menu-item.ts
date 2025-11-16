import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-menu-item.css';
import template from './au-menu-item.html';

@customElement({
  name: 'au-menu-item',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuMenuItemCustomElement implements ICustomElementViewModel {
  @bindable public value: any = '';
  @bindable public disabled: boolean = false;

  public onClick(event: Event) {
    if (this.disabled) {
      return;
    }
    (event.currentTarget as HTMLElement).dispatchEvent(new CustomEvent('menu-select', { detail: this.value, bubbles: true }));
  }
}
