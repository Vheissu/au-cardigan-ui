import { DefaultComponents } from './components';
import { DI, IContainer } from '@aurelia/kernel';

function createConfiguration(components: any[]) {
    return {
        register(container: IContainer): IContainer {
            return container.register(
                ...components
            );
        },

        createContainer(): IContainer {
            return this.register(DI.createContainer());
        }
    };
}

const cardiganConfiguration = createConfiguration(DefaultComponents);

export const CardiganConfiguration = {
    customize(components: any[] = []) {
        return createConfiguration([
            ...DefaultComponents,
            ...components
        ]);
    },
    ...cardiganConfiguration
};
