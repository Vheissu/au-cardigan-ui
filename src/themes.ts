import { CardiganThemeOptions } from './theme';

export type CardiganThemeName = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset';

export type CardiganTheme = CardiganThemeName | CardiganThemeOptions;

/**
 * Built-in theme presets. Each preset is a plain `CardiganThemeOptions` object,
 * so it can be used directly, spread into a custom theme, or passed by name:
 *
 *   CardiganConfiguration.withTheme('dark')
 *   CardiganConfiguration.from({ theme: { ...CardiganThemes.ocean, typography: { fontSize: '15px' } } })
 */
export const CardiganThemes: Record<CardiganThemeName, CardiganThemeOptions> = {
    light: {
        colors: {
            primary: '#0466C8',
            secondary: '#495057',
            bright: '#FF6B6B',
            purple: '#6610F2',
            success: '#52B788',
            error: '#DC3545',
            info: '#00B4D8',
            light: '#F8F9FA',
            dark: '#212529',
            white: '#FFFFFF',
            lightGrey: '#CED4DA',
            mediumGrey: '#495057',
            skyBlue: '#ADE8F4',
            blueAlt: '#2744F2',
            background: '#FFFFFF',
            surface: '#F8F9FA',
            text: '#212529',
            textMuted: '#6C757D',
            border: '#CED4DA'
        }
    },
    dark: {
        colors: {
            primary: '#5C9DFF',
            secondary: '#ADB5BD',
            bright: '#FF7B7B',
            purple: '#9D6BFF',
            success: '#63C892',
            error: '#F06A75',
            info: '#4CC9E8',
            light: '#22262C',
            dark: '#E9ECEF',
            white: '#16191D',
            lightGrey: '#3A4149',
            mediumGrey: '#ADB5BD',
            skyBlue: '#24445A',
            blueAlt: '#6C8CFF',
            background: '#101317',
            surface: '#1A1E24',
            text: '#E9ECEF',
            textMuted: '#9AA4AF',
            border: '#343B44'
        }
    },
    ocean: {
        colors: {
            primary: '#0E7490',
            secondary: '#33566B',
            bright: '#F76C5E',
            purple: '#5E60CE',
            success: '#2A9D8F',
            error: '#E63946',
            info: '#48CAE4',
            light: '#F0F7F9',
            dark: '#10303B',
            white: '#FFFFFF',
            lightGrey: '#C2D6DD',
            mediumGrey: '#4E6E7E',
            skyBlue: '#ADE8F4',
            blueAlt: '#145DA0',
            background: '#F7FBFC',
            surface: '#EAF4F7',
            text: '#10303B',
            textMuted: '#4E6E7E',
            border: '#C2D6DD'
        }
    },
    forest: {
        colors: {
            primary: '#2D6A4F',
            secondary: '#52796F',
            bright: '#E76F51',
            purple: '#6D597A',
            success: '#40916C',
            error: '#BC4749',
            info: '#468FAF',
            light: '#F3F7F2',
            dark: '#1B3A2A',
            white: '#FFFFFF',
            lightGrey: '#CDDACD',
            mediumGrey: '#5C6F5E',
            skyBlue: '#B7E4C7',
            blueAlt: '#386641',
            background: '#F6FAF5',
            surface: '#EBF2E9',
            text: '#1B3A2A',
            textMuted: '#5C6F5E',
            border: '#CDDACD'
        }
    },
    sunset: {
        colors: {
            primary: '#E85D04',
            secondary: '#7F5539',
            bright: '#FF477E',
            purple: '#B5179E',
            success: '#6A994E',
            error: '#D00000',
            info: '#F48C06',
            light: '#FFF4EA',
            dark: '#4A2511',
            white: '#FFFDFA',
            lightGrey: '#F1D8C3',
            mediumGrey: '#92603F',
            skyBlue: '#FFD9B8',
            blueAlt: '#C9184A',
            background: '#FFFAF4',
            surface: '#FFF1E3',
            text: '#4A2511',
            textMuted: '#92603F',
            border: '#F1D8C3'
        }
    }
};

export function isThemeName(theme: unknown): theme is CardiganThemeName {
    return typeof theme === 'string' && theme in CardiganThemes;
}

export function resolveTheme(theme?: CardiganTheme): CardiganThemeOptions | undefined {
    if (theme == null) {
        return undefined;
    }
    if (typeof theme === 'string') {
        const preset = CardiganThemes[theme as CardiganThemeName];
        if (!preset) {
            throw new Error(`Unknown Cardigan theme: "${theme}". Available themes: ${Object.keys(CardiganThemes).join(', ')}`);
        }
        return preset;
    }
    return theme;
}
