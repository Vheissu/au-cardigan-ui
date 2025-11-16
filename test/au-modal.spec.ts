import { createFixture } from '@aurelia/testing';
import { AuModalCustomElement } from './../src/components/au-modal';

describe('Modal', () => {
    test('should render modal', async () => {
        const { appHost, startPromise, stop } = await createFixture(
            '<au-modal>Modal content</au-modal>',
            class App {},
            [AuModalCustomElement]
        );

        await startPromise;

        const modal = appHost.querySelector('au-modal')?.shadowRoot;
        expect(modal?.querySelector('.container')).toBeDefined();
        expect(modal?.querySelector('.backdrop')).toBeDefined();
        expect(modal?.querySelector('.wrapper')).toBeDefined();
        expect(modal?.querySelector('.modal-content')).toBeDefined();

        await stop(true);
    });

    test('should set size correctly', async () => {
        const { appHost, startPromise, stop } = await createFixture(
            '<au-modal size="lg">Modal content</au-modal>',
            class App {},
            [AuModalCustomElement]
        );

        await startPromise;

        const modal = appHost.querySelector('au-modal') as unknown as AuModalCustomElement;
        const wrapper = modal.shadowRoot?.querySelector('.wrapper') as HTMLElement;

        expect(wrapper.style.width).toBe('900px');

        await stop(true);
    });

    test('should set role attribute', async () => {
        const { appHost, startPromise, stop } = await createFixture(
            '<au-modal role="alertdialog">Modal content</au-modal>',
            class App {},
            [AuModalCustomElement]
        );

        await startPromise;

        const modal = appHost.querySelector('au-modal') as unknown as AuModalCustomElement;
        const container = modal.shadowRoot?.querySelector('.container') as HTMLElement;

        expect(container.getAttribute('role')).toBe('alertdialog');

        await stop(true);
    });

    test('should call onClose when backdrop is clicked', async () => {
        const viewModel = class ViewModel {
            onClose = jest.fn();
        };

        const { appHost, startPromise, stop, component } = await createFixture(
            '<au-modal click-close="true" on-close.bind="onClose">Modal content</au-modal>',
            viewModel,
            [AuModalCustomElement]
        );

        await startPromise;

        const modal = appHost.querySelector('au-modal') as unknown as AuModalCustomElement;
        const backdrop = modal.shadowRoot?.querySelector('.backdrop') as HTMLElement;

        backdrop.click();

        expect(component.onClose).toHaveBeenCalled();

        await stop(true);
    });

    test('should call onClose when Escape key is pressed', async () => {
        const viewModel = class ViewModel {
            onClose = jest.fn();
        };

        const { appHost, startPromise, stop, component } = await createFixture(
            '<au-modal on-close.bind="onClose">Modal content</au-modal>',
            viewModel,
            [AuModalCustomElement]
        );

        await startPromise;

        const event = new KeyboardEvent('keyup', { keyCode: 27 });
        window.dispatchEvent(event);

        expect(component.onClose).toHaveBeenCalled();

        await stop(true);
    });

    test('should render content in slots', async () => {
        const { appHost, startPromise, stop } = await createFixture(
            `<au-modal>
                <div slot="heading">Modal Heading</div>
                <p>Modal Body</p>
            </au-modal>`,
            class App {},
            [AuModalCustomElement]
        );

        await startPromise;

        const modal = appHost.querySelector('au-modal')?.shadowRoot;
        const headingSlot = modal?.querySelector('slot[name="heading"]');
        const defaultSlot = modal?.querySelector('slot:not([name])');

        expect(headingSlot).toBeDefined();
        expect(defaultSlot).toBeDefined();

        await stop(true);
    });
});
