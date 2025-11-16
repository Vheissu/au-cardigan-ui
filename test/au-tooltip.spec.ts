import { createFixture } from '@aurelia/testing';
import { AuTooltipCustomElement } from './../src/components/au-tooltip';

describe('Tooltip', () => {
  test('should render tooltip text', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-tooltip message="Hello">Hover</au-tooltip>', class App {}, [AuTooltipCustomElement]);

    await startPromise;

    const tooltip = appHost.querySelector('au-tooltip')?.shadowRoot?.querySelector('.tooltip');

    expect(tooltip?.textContent).toBe('Hello');

    await tearDown();
  });

  test('should apply position class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-tooltip message="Hi" position="bottom">Hover</au-tooltip>', class App {}, [AuTooltipCustomElement]);

    await startPromise;

    const tooltip = appHost.querySelector('au-tooltip')?.shadowRoot?.querySelector('.tooltip');

    expect(tooltip?.classList.contains('bottom')).toBeTruthy();

    await tearDown();
  });
});
