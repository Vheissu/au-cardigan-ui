import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-tooltip.css';
import template from './au-tooltip.html';

@customElement({
  name: 'au-tooltip',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuTooltipCustomElement implements ICustomElementViewModel {
  @bindable public message: string = '';
  @bindable public position: 'top' | 'bottom' | 'left' | 'right' = 'top';
}
