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
  @bindable public percentage: number = 0;
  @bindable public color: string = 'primary';
}
