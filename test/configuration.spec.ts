import { CardiganConfiguration } from '../src/configuration';
import { ComponentRegistry } from '../src/components';
import type { IContainer, IRegistry } from '@aurelia/kernel';

class StubContainer {
  public registered: unknown[] = [];
  register(...params: unknown[]) {
    this.registered.push(...params);
    return this;
  }
}

describe('CardiganConfiguration', () => {
  afterEach(() => {
    document.querySelector('style[data-au-cardigan-theme]')?.remove();
  });

  test('select registers an explicit subset', () => {
    const config = CardiganConfiguration.select(['au-button', 'au-card']);
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    expect(container.registered).toEqual([
      ComponentRegistry.get('au-button'),
      ComponentRegistry.get('au-card'),
    ]);
  });

  test('from excludes named components', () => {
    const config = CardiganConfiguration.from({ exclude: ['au-toast'] });
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    expect(container.registered).not.toContain(ComponentRegistry.get('au-toast'));
  });

  test('customize appends custom registries', () => {
    const customRegistry: IRegistry = {
      register(cont: IContainer) {
        return cont;
      },
    } as IRegistry;

    const config = CardiganConfiguration.customize([customRegistry]);
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    expect(container.registered).toContain(customRegistry);
  });

  test('withTheme injects CSS variables', () => {
    const config = CardiganConfiguration.withTheme({ colors: { primary: '#123456' } });
    const container = new StubContainer();

    config.register(container as unknown as IContainer);

    const style = document.querySelector('style[data-au-cardigan-theme]');
    expect(style?.textContent).toContain('--au-cardigan-color-primary: #123456;');
  });
});
