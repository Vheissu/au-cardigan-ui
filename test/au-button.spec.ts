import { AuButtonCustomElement } from '../src/components/au-button';
import { createFixture } from '@aurelia/testing';

describe('Button', () => {

    test('should render button element', async () => {
        const { appHost, startPromise, tearDown } = createFixture('<au-button>My button</au-button>', class App {}, [ AuButtonCustomElement ]);

        await startPromise;

        expect(appHost.innerHTML).toContain('My button');

        await tearDown;
    });

});