import { applyTheme } from '../src/theme';
import { CardiganThemes, resolveTheme, type CardiganThemeName } from '../src/themes';

export { render, renderToCanvas } from '@aurelia/storybook';

export const globalTypes = {
    cardiganTheme: {
        name: 'Theme',
        description: 'Cardigan theme preset',
        toolbar: {
            title: 'Theme',
            icon: 'paintbrush',
            items: Object.keys(CardiganThemes),
            dynamicTitle: true,
        },
    },
};

export const initialGlobals = {
    cardiganTheme: 'light' satisfies CardiganThemeName,
};

export const decorators = [
    (storyFn: () => unknown, context: { globals: { cardiganTheme?: CardiganThemeName } }) => {
        const theme = resolveTheme(context.globals.cardiganTheme ?? 'light');
        applyTheme(theme);
        const colors = theme?.colors ?? {};
        document.body.style.background = colors.background ?? '#FFFFFF';
        document.body.style.color = colors.text ?? '#212529';
        document.body.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', sans-serif";
        return storyFn();
    },
];

export const parameters = {
    layout: 'padded',
};
