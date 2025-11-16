import { createFixture } from '@aurelia/testing';
import { AuSkeletonCustomElement } from '../src/components/au-skeleton';

describe('Skeleton', () => {
  test('renders multiple text lines', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-skeleton lines="3"></au-skeleton>',
      class App {},
      [AuSkeletonCustomElement]
    );

    await startPromise;

    const lines = appHost
      .querySelector('au-skeleton')
      ?.shadowRoot?.querySelectorAll('.skeleton-line');

    expect(lines?.length).toBe(3);

    await stop(true);
  });

  test('renders block for avatar shape', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-skeleton shape="avatar"></au-skeleton>',
      class App {},
      [AuSkeletonCustomElement]
    );

    await startPromise;

    const block = appHost
      .querySelector('au-skeleton')
      ?.shadowRoot?.querySelector('.skeleton-block');

    expect(block).toBeTruthy();

    await stop(true);
  });
});
