import { createFixture } from '@aurelia/testing';
import { AuProgressCustomElement } from './../src/components/au-progress';

describe('Progress', () => {
  test('should render progress bar', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-progress value="25" max="100"></au-progress>', class App {}, [AuProgressCustomElement]);

    await startPromise;

    const bar = appHost.querySelector('au-progress')?.shadowRoot?.querySelector('.bar');

    expect(bar).toBeDefined();
    expect(bar?.getAttribute('style')).toContain('width: 25');

    await tearDown();
  });

  test('should apply color class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-progress color="success"></au-progress>', class App {}, [AuProgressCustomElement]);

    await startPromise;

    const progress = appHost.querySelector('au-progress')?.shadowRoot?.querySelector('.progress');

    expect(progress?.classList.contains('success')).toBeTruthy();

    await tearDown();
  });
});
