import { createFixture } from '@aurelia/testing';
import { AuAvatarCustomElement } from './../src/components/au-avatar';

describe('Avatar', () => {
  test('should render image when src provided', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-avatar src="test.png"></au-avatar>', class App {}, [AuAvatarCustomElement]);

    await startPromise;

    const img = appHost.querySelector('au-avatar')?.shadowRoot?.querySelector('img');

    expect(img).toBeDefined();

    await tearDown();
  });

  test('should display initials when no image', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-avatar initials="AB"></au-avatar>', class App {}, [AuAvatarCustomElement]);

    await startPromise;

    const span = appHost.querySelector('au-avatar')?.shadowRoot?.querySelector('span');

    expect(span?.textContent).toBe('AB');

    await tearDown();
  });

  test('should apply size class', async () => {
    const { appHost, startPromise, tearDown } = await createFixture('<au-avatar size="large"></au-avatar>', class App {}, [AuAvatarCustomElement]);

    await startPromise;

    const wrapper = appHost.querySelector('au-avatar')?.shadowRoot?.querySelector('.avatar');

    expect(wrapper?.classList.contains('large')).toBeTruthy();

    await tearDown();
  });
});
