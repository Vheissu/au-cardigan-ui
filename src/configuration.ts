import { ComponentEntries, ComponentRegistry, DefaultComponents } from './components';
import { applyTheme, CardiganThemeOptions } from './theme';
import { DI, IContainer, IRegistry } from '@aurelia/kernel';

type ComponentSelector = string | IRegistry;

interface InternalConfigurationOptions {
    components: IRegistry[];
    theme?: CardiganThemeOptions;
}

export interface CardiganConfigurationOptions {
    include?: ComponentSelector[];
    exclude?: string[];
    add?: ComponentSelector[];
    theme?: CardiganThemeOptions;
}

function createConfiguration(options: InternalConfigurationOptions) {
    const { components, theme } = options;
    return {
        register(container: IContainer): IContainer {
            if (theme) {
                applyTheme(theme);
            }
            return container.register(
                ...components
            );
        },

        createContainer(): IContainer {
            return this.register(DI.createContainer());
        }
    };
}

const cardiganConfiguration = createConfiguration({ components: DefaultComponents });

function normalizeComponents(options: CardiganConfigurationOptions = {}): IRegistry[] {
    const include = options.include && options.include.length
        ? resolveComponents(options.include)
        : [...DefaultComponents];
    const addition = options.add ? resolveComponents(options.add) : [];
    const combined = [...include, ...addition];
    const unique = Array.from(new Set(combined));

    if (!options.exclude || options.exclude.length === 0) {
        return unique;
    }

    const excludeSet = new Set(options.exclude.map(name => name.trim().toLowerCase()));
    return unique.filter(entry => {
        const name = findNameForRegistry(entry);
        return !name || !excludeSet.has(name);
    });
}

function resolveComponents(selectors: ComponentSelector[]): IRegistry[] {
    return selectors.map(selector => {
        if (typeof selector === 'string') {
            const key = selector.trim().toLowerCase();
            const registry = ComponentRegistry.get(key);
            if (!registry) {
                throw new Error(`Unknown Cardigan component: ${selector}`);
            }
            return registry;
        }
        return selector;
    });
}

function findNameForRegistry(registry: IRegistry): string | undefined {
    const entry = ComponentEntries.find(item => item.registry === registry);
    return entry?.name;
}

export const CardiganConfiguration = Object.assign(cardiganConfiguration, {
    customize(components: IRegistry[] = []) {
        return createConfiguration({
            components: normalizeComponents({ add: components })
        });
    },
    from(options: CardiganConfigurationOptions = {}) {
        return createConfiguration({
            components: normalizeComponents(options),
            theme: options.theme
        });
    },
    select(include: ComponentSelector[], options: Omit<CardiganConfigurationOptions, 'include'> = {}) {
        return CardiganConfiguration.from({
            ...options,
            include
        });
    },
    withTheme(theme: CardiganThemeOptions, options: Omit<CardiganConfigurationOptions, 'theme'> = {}) {
        return CardiganConfiguration.from({
            ...options,
            theme
        });
    }
});
