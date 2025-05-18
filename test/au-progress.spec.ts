import { createFixture } from '@aurelia/testing';
import { AuProgressCustomElement } from './../src/components/au-progress';

describe('Progress', () => {
  test('should set bar width', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-progress percentage="25"></au-progress>', class App {}, [AuProgressCustomElement]);

    await startPromise;

    const bar = appHost.querySelector('au-progress')?.shadowRoot?.querySelector('.bar');
    expect(bar?.getAttribute('style')).toContain('width: 25%');

    await tearDown();
  });

  test('should apply color class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-progress color="success" percentage="10"></au-progress>', class App {}, [AuProgressCustomElement]);

    await startPromise;

    const bar = appHost.querySelector('au-progress')?.shadowRoot?.querySelector('.bar');
    expect(bar?.classList.contains('success')).toBeTruthy();

    await tearDown();
  });
});
