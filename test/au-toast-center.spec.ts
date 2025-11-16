import { createFixture } from '@aurelia/testing';
import { AuToastCenterCustomElement } from '../src/components/au-toast-center';

describe('Toast Center', () => {
  test('queues toast and auto dismisses after timeout', async () => {
    jest.useFakeTimers();
    const { component, startPromise, stop } = await createFixture(
      '<au-toast-center view-model.ref="center"></au-toast-center>',
      class App {
        public center?: AuToastCenterCustomElement;
      },
      [AuToastCenterCustomElement]
    );

    await startPromise;

    expect(component.center).toBeDefined();
    component.center?.show({ message: 'Saved', timeout: 1000 });

    expect(component.center?.toasts.length).toBe(1);

    jest.advanceTimersByTime(1000);

    expect(component.center?.toasts.length).toBe(0);

    jest.useRealTimers();
    await stop(true);
  });

  test('enforces queue limit', async () => {
    const { component, startPromise, stop } = await createFixture(
      '<au-toast-center view-model.ref="center"></au-toast-center>',
      class App {
        public center?: AuToastCenterCustomElement;
      },
      [AuToastCenterCustomElement]
    );

    await startPromise;

    if (component.center) {
      component.center.limit = 1;
      component.center.show({ message: 'One', timeout: 0 });
      component.center.show({ message: 'Two', timeout: 0 });

      expect(component.center.toasts.length).toBe(1);
      expect(component.center.toasts[0].message).toBe('Two');
    }

    await stop(true);
  });
});
