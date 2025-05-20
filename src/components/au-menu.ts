import { ICustomElementViewModel, customElement, shadowCSS } from '@aurelia/runtime-html';
import SharedStyles from '../variables.css';
import styles from './au-menu.css';
import template from './au-menu.html';

@customElement({
  name: 'au-menu',
  template,
  dependencies: [shadowCSS(SharedStyles, styles)],
  shadowOptions: { mode: 'open' }
})
export class AuMenuCustomElement implements ICustomElementViewModel {
  private items: HTMLElement[] = [];
  private activeIndex = -1;
  private typeBuffer = '';
  private typeTimeout: any = null;

  constructor(private readonly element: HTMLElement) {}

  attached() {
    this.refreshItems();
  }

  private refreshItems() {
    this.items = Array.from(this.element.querySelectorAll('au-menu-item')) as HTMLElement[];
  }

  private focusItem(index: number) {
    if (this.items.length === 0) {
      return;
    }
    index = Math.max(0, Math.min(index, this.items.length - 1));
    const item = this.items[index] as HTMLElement;
    (item as HTMLElement).focus();
    this.activeIndex = index;
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.items.length === 0) {
      this.refreshItems();
    }
    switch (event.key) {
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        this.focusItem(this.activeIndex + 1 >= this.items.length ? 0 : this.activeIndex + 1);
        break;
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        this.focusItem(this.activeIndex - 1 < 0 ? this.items.length - 1 : this.activeIndex - 1);
        break;
      default:
        if (event.key && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          this.typeBuffer += event.key.toLowerCase();
          clearTimeout(this.typeTimeout);
          this.typeTimeout = setTimeout(() => {
            this.typeBuffer = '';
          }, 500);
          const match = this.items.find(i => (i.textContent || '').trim().toLowerCase().startsWith(this.typeBuffer));
          if (match) {
            const index = this.items.indexOf(match);
            this.focusItem(index);
          }
        }
        break;
    }
  };
}
