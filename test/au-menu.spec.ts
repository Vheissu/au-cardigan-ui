import { createFixture } from '@aurelia/testing';
import { AuMenuCustomElement } from '../src/components/au-menu';
import { AuMenuItemCustomElement } from '../src/components/au-menu-item';

describe('Menu', () => {
  test('should render menu items', async () => {
    const template = `<au-menu><au-menu-item value="a">A</au-menu-item><au-menu-item value="b">B</au-menu-item></au-menu>`;
    const { appHost, startPromise, tearDown } = await createFixture(template, class App {}, [AuMenuCustomElement, AuMenuItemCustomElement]);

    await startPromise;

    const items = appHost.querySelectorAll('au-menu-item');
    expect(items.length).toBe(2);

    await tearDown();
  });
});
