import { bindable, customElement, ICustomElementViewModel, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-avatar.css';
import template from './au-avatar.html';

@customElement({
  name: 'au-avatar',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuAvatarCustomElement implements ICustomElementViewModel {
  @bindable public src: string = '';
  @bindable public alt: string = '';
  @bindable public initials: string = '';
  @bindable public size: 'small' | 'medium' | 'large' = 'medium';
}
