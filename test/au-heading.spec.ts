import { AuHeadingCustomElement } from './../src/components/au-heading';
import { createFixture } from '@aurelia/testing';

const App = class App {
    size = 'medium';
};

describe('Heading', () => {

    test('should render heading element', async () => {
        const { appHost, startPromise, tearDown } = createFixture('<au-heading>My Heading</au-heading>', App, [ AuHeadingCustomElement ]);

        await startPromise;

        expect(appHost.innerHTML).toContain('<h1>');

        await tearDown;
    });

});