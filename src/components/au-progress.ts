import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-progress.css';
import template from './au-progress.html';

@customElement({
  name: 'au-progress',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuProgressCustomElement implements ICustomElementViewModel {
  @bindable public value: number = 0;
  @bindable public max: number = 100;
  @bindable public color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'light' | 'dark' = 'primary';

  public get percentage(): number {
    if (this.max === 0) {
      return 0;
    }
    return (this.value / this.max) * 100;
  }
}
