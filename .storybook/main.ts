import { mergeConfig, type InlineConfig, type Plugin } from 'vite';
import type { StorybookConfig } from 'storybook/internal/types';

const insideSrc = /[\\/]src[\\/]/;

/**
 * Cardigan components import templates and styles as strings
 * (`import template from './au-x.html'` feeding @customElement, and
 * css strings feeding shadowCSS()). Vite only exposes file text via
 * the `?raw` / `?inline` queries, so rewrite bare imports coming from
 * library source files. Using the queries (rather than a transform)
 * also keeps `storybook build` from parsing the templates as HTML pages.
 */
function cardiganStringImports(): Plugin {
    return {
        name: 'cardigan-string-imports',
        enforce: 'pre',
        async resolveId(source, importer) {
            if (!importer || source.includes('?') || !insideSrc.test(importer)) {
                return null;
            }
            const query = source.endsWith('.html') ? '?raw'
                : source.endsWith('.css') ? '?inline'
                : null;
            if (!query) {
                return null;
            }
            const resolved = await this.resolve(source, importer, { skipSelf: true });
            if (resolved && !resolved.id.includes('?')) {
                return `${resolved.id}${query}`;
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
        plugins: [cardiganStringImports()],
    }),
};

export default config;
