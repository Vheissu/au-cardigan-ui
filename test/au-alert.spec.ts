import { createFixture } from '@aurelia/testing';
import { AuAlertCustomElement } from './../src/components/au-alert';

describe('Alert', () => {
  test('should render alert', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-alert>Warning</au-alert>', class App {}, [AuAlertCustomElement]);

    await startPromise;

    const alert = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('.alert');
    expect(alert).toBeDefined();

    await tearDown();
  });

  test('dismissible alert closes', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-alert dismissible>Bye</au-alert>', class App {}, [AuAlertCustomElement]);

    await startPromise;

    const button = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('.close');
    button?.dispatchEvent(new Event('click'));

    const alert = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('.alert');
    expect(alert).toBeNull();

    await tearDown();
  });
});
