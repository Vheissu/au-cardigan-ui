import { IContainer } from '@aurelia/kernel';
import VariablesCss from './variables.css';

const globalStyleAttribute = 'data-au-cardigan-global';

export function buildGlobalStyles(extraCss: string = ''): string {
    return [VariablesCss, extraCss].filter(Boolean).join('\n');
}

export function applyGlobalStyles(extraCss?: string) {
    if (typeof document === 'undefined') {
        return;
    }
    const css = buildGlobalStyles(extraCss);
    if (!css.trim()) {
        return;
    }
    const head = document.head ?? document.getElementsByTagName('head')[0] ?? document.documentElement;
    let style = head.querySelector<HTMLStyleElement>(`style[${globalStyleAttribute}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(globalStyleAttribute, 'true');
        head.appendChild(style);
    }
    style.textContent = css;
}

export const CardiganGlobalStyles = {
    register(container: IContainer) {
        applyGlobalStyles();
        return container;
    }
};
