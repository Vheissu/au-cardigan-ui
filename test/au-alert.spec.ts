import { createFixture } from '@aurelia/testing';
import { AuAlertCustomElement } from './../src/components/au-alert';

describe('Alert', () => {
  test('should render alert', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-alert>Hello</au-alert>', class App {}, [AuAlertCustomElement]);

    await startPromise;

    const alert = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('div');

    expect(alert).toBeDefined();

    await tearDown();
  });

  test('dismissible alert can be closed', async () => {
    const { appHost, startPromise, tearDown, component } = await createFixture('<au-alert dismissible ref=\"alert\">Hello</au-alert>', class App { alert!: AuAlertCustomElement }, [AuAlertCustomElement]);

    await startPromise;

    const button = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('button');
    expect(button).toBeDefined();

    button?.dispatchEvent(new Event('click'));

    await tearDown();
  });

  test('should apply color class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-alert color="success">Hello</au-alert>', class App {}, [AuAlertCustomElement]);

    await startPromise;

    const alert = appHost.querySelector('au-alert')?.shadowRoot?.querySelector('div');

    expect(alert?.classList.contains('success')).toBeTruthy();

    await tearDown();
  });
});
