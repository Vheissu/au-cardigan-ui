import { createFixture } from '@aurelia/testing';
import { AuTabsCustomElement } from '../src/components/au-tabs';
import { AuTabPanelCustomElement } from '../src/components/au-tab-panel';

describe('Tabs', () => {
  const template = `
    <au-tabs>
      <au-tab-panel label="First">Alpha</au-tab-panel>
      <au-tab-panel label="Second">Beta</au-tab-panel>
    </au-tabs>
  `;

  test('activates first tab by default', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuTabsCustomElement, AuTabPanelCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-tabs');
    const tabs = host?.shadowRoot?.querySelectorAll('button.tab');

    expect(tabs?.[0]?.getAttribute('aria-selected')).toBe('true');
    expect(tabs?.[1]?.getAttribute('aria-selected')).toBe('false');

    await stop(true);
  });

  test('clicking a tab activates corresponding panel', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuTabsCustomElement, AuTabPanelCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-tabs');
    const tabs = host?.shadowRoot?.querySelectorAll('button.tab');

    tabs?.[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();

    expect(tabs?.[1]?.getAttribute('aria-selected')).toBe('true');

    await stop(true);
  });

  test('arrow keys move focus and activate when auto mode', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuTabsCustomElement, AuTabPanelCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector('au-tabs');
    const second = host?.shadowRoot?.querySelectorAll('button.tab')?.[0];

    second?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    await Promise.resolve();

    const tabs = host?.shadowRoot?.querySelectorAll('button.tab');

    expect(tabs?.[1]?.getAttribute('aria-selected')).toBe('true');

    await stop(true);
  });
});
