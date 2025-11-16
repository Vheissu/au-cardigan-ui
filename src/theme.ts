export type CardiganColorToken =
    | 'primary'
    | 'secondary'
    | 'bright'
    | 'purple'
    | 'success'
    | 'error'
    | 'info'
    | 'light'
    | 'dark'
    | 'white'
    | 'lightGrey'
    | 'mediumGrey'
    | 'skyBlue'
    | 'blueAlt';

export interface CardiganThemeOptions {
    colors?: Partial<Record<CardiganColorToken, string>>;
    radius?: Partial<Record<'small' | 'medium' | 'large', string>>;
    spacing?: Partial<Record<'xs' | 'sm' | 'md' | 'lg', string>>;
    typography?: {
        fontFamily?: string;
        fontSize?: string;
    };
}

const themeStyleAttribute = 'data-au-cardigan-theme';

export function buildThemeCss(theme: CardiganThemeOptions): string {
    const lines: string[] = [];
    if (theme.colors) {
        pushTokens('color', theme.colors, lines);
    }
    if (theme.radius) {
        pushTokens('radius', theme.radius, lines);
    }
    if (theme.spacing) {
        pushTokens('spacing', theme.spacing, lines);
    }
    if (theme.typography?.fontFamily) {
        lines.push(`  --au-cardigan-font-family-base: ${theme.typography.fontFamily};`);
    }
    if (theme.typography?.fontSize) {
        lines.push(`  --au-cardigan-font-size-base: ${theme.typography.fontSize};`);
    }
    if (!lines.length) {
        return '';
    }
    return `:root {\n${lines.join('\n')}\n}`;
}

export function applyTheme(theme?: CardiganThemeOptions) {
    if (!theme) {
        return;
    }
    if (typeof document === 'undefined') {
        return;
    }
    const css = buildThemeCss(theme);
    if (!css) {
        return;
    }
    let style = document.head.querySelector<HTMLStyleElement>(`style[${themeStyleAttribute}]`);
    if (!style) {
        style = document.createElement('style');
        style.setAttribute(themeStyleAttribute, 'true');
        document.head.appendChild(style);
    }
    style.textContent = css;
}

function pushTokens(prefix: string, values: Record<string, string | undefined>, lines: string[]) {
    Object.entries(values).forEach(([token, value]) => {
        if (!value) {
            return;
        }
        lines.push(`  --au-cardigan-${prefix}-${token}: ${value};`);
    });
}
