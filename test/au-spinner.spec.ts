import { createFixture } from '@aurelia/testing';
import { AuSpinnerCustomElement } from '../src/components/au-spinner';

describe('Spinner', () => {
  test('renders with requested size', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-spinner size="lg"></au-spinner>',
      class App {},
      [AuSpinnerCustomElement]
    );

    await startPromise;

    const spinner = appHost
      .querySelector('au-spinner')
      ?.shadowRoot?.querySelector('.spinner');

    expect(spinner?.classList.contains('lg')).toBe(true);

    await stop(true);
  });

  test('provides accessible label', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-spinner label="Loading chart data"></au-spinner>',
      class App {},
      [AuSpinnerCustomElement]
    );

    await startPromise;

    const spinner = appHost
      .querySelector('au-spinner')
      ?.shadowRoot?.querySelector('.spinner');

    expect(spinner?.getAttribute('aria-label')).toBe('Loading chart data');

    await stop(true);
  });
});
