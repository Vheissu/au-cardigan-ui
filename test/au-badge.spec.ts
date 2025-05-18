import { createFixture } from '@aurelia/testing';
import { AuBadgeCustomElement } from './../src/components/au-badge';

describe('Badge', () => {
  test('should render badge', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-badge>Hi</au-badge>', class App {}, [AuBadgeCustomElement]);

    await startPromise;

    const badge = appHost.querySelector('au-badge')?.shadowRoot?.querySelector('span');

    expect(badge).toBeDefined();

    await tearDown();
  });

  test('should render badge with color class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-badge color="success">Hi</au-badge>', class App {}, [AuBadgeCustomElement]);

    await startPromise;

    const badge = appHost.querySelector('au-badge')?.shadowRoot?.querySelector('span');

    expect(badge?.classList.contains('success')).toBeTruthy();

    await tearDown();
  });
});
