import { AuSelectCustomElement } from './components/au-select';
import { AuModalCustomElement } from './components/au-modal';
import { AuImageCustomElement } from './components/au-image';
import { AuButtonCustomElement } from './components/au-button';
import { DI, IContainer, IRegistry } from '@aurelia/kernel';

export const DefaultComponents: IRegistry[] = [
    AuButtonCustomElement as unknown as IRegistry,
    AuImageCustomElement as unknown as IRegistry,
    AuModalCustomElement as unknown as IRegistry,
    AuSelectCustomElement as unknown as IRegistry
];

const cardiganConfiguration = {
    register(container: IContainer): IContainer {
        return container.register(
            ...DefaultComponents
        );
    },

    createContainer(): IContainer {
        return this.register(DI.createContainer());
    }
};

export const CardiganConfiguration = {
    customize(components: any[] = []) {
        return { ...cardiganConfiguration };
    },
    ...cardiganConfiguration
};