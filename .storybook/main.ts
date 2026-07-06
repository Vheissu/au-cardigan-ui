import { mergeConfig, type InlineConfig, type Plugin } from 'vite';
import type { StorybookConfig } from 'storybook/internal/types';

const insideSrc = /[\\/]src[\\/]/;

/**
 * Cardigan components import their templates as strings
 * (`import template from './au-x.html'`), which Vite does not
 * understand natively. Convert src html files into string modules.
 */
function cardiganTemplates(): Plugin {
    return {
        name: 'cardigan-templates',
        enforce: 'pre',
        transform(code, id) {
            if (id.endsWith('.html') && insideSrc.test(id)) {
                return {
                    code: `export default ${JSON.stringify(code)};`,
                    map: null,
                };
            }
        },
    };
}

/**
 * Cardigan imports css files as strings and feeds them to shadowCSS().
 * Vite 5+ only exposes css text via the `?inline` query, so rewrite
 * bare css imports coming from library source files.
 */
function cardiganInlineCss(): Plugin {
    return {
        name: 'cardigan-inline-css',
        enforce: 'pre',
        async resolveId(source, importer) {
            if (!importer || !source.endsWith('.css') || source.includes('?') || !insideSrc.test(importer)) {
                return null;
            }
            const resolved = await this.resolve(source, importer, { skipSelf: true });
            if (resolved && !resolved.id.includes('?')) {
                return `${resolved.id}?inline`;
            }
            return null;
        },
    };
}

const config: StorybookConfig & { viteFinal?: (config: InlineConfig) => InlineConfig | Promise<InlineConfig> } = {
    stories: ['../stories/**/*.stories.@(ts|js|mdx)'],
    addons: [],
    framework: {
        name: '@aurelia/storybook',
        options: {},
    },
    core: {
        builder: '@storybook/builder-vite',
    },
    viteFinal: async (viteConfig) => mergeConfig(viteConfig, {
        plugins: [cardiganTemplates(), cardiganInlineCss()],
    }),
};

export default config;
