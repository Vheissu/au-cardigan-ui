import { createFixture } from '@aurelia/testing';
import { AuCardCustomElement } from '../src/components/au-card';

describe('Card', () => {
  test('renders heading fallback', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-card heading="Profile">Hello</au-card>',
      class App {},
      [AuCardCustomElement]
    );

    await startPromise;

    const title = appHost
      .querySelector('au-card')
      ?.shadowRoot?.querySelector('.card-title');

    expect(title?.textContent).toContain('Profile');

    await stop(true);
  });

  test('suppresses fallback header when slot content exists', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-card><div slot="header" id="custom-header">Custom</div></au-card>',
      class App {},
      [AuCardCustomElement]
    );

    await startPromise;

    const fallback = appHost
      .querySelector('au-card')
      ?.shadowRoot?.querySelector('.card-title');

    expect(fallback).toBeNull();

    await stop(true);
  });

  test('interactive cards receive focusability', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-card interactive="true">Focusable</au-card>',
      class App {},
      [AuCardCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-card')?.shadowRoot?.querySelector('.card');

    expect(host?.getAttribute('tabindex')).toBe('0');

    await stop(true);
  });
});
