import { createFixture } from '@aurelia/testing';
import { AuCodeCustomElement } from '../src/components/au-code';

describe('AuCode', () => {
  test('should render code element', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-code>const example = "test";</au-code>',
      class App {},
      [AuCodeCustomElement]
    );

    await startPromise;

    const codeElement = appHost.querySelector('au-code')?.shadowRoot?.querySelector('code');
    expect(codeElement).toBeDefined();
    expect(codeElement?.textContent?.trim()).toBe('const example = "test";');

    await stop(true);
  });

  test('should render pre element when type is pre', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-code type="pre">const example = "test";</au-code>',
      class App {},
      [AuCodeCustomElement]
    );

    await startPromise;

    const preElement = appHost.querySelector('au-code')?.shadowRoot?.querySelector('pre');
    expect(preElement).toBeDefined();

    await stop(true);
  });

  test('should apply language class', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-code language="javascript">const example = "test";</au-code>',
      class App {},
      [AuCodeCustomElement]
    );

    await startPromise;

    const codeElement = appHost.querySelector('au-code')?.shadowRoot?.querySelector('code');
    expect(codeElement?.classList.contains('javascript')).toBeTruthy();

    await stop(true);
  });

  test('should render copy button when copyable is true', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-code copyable="true">const example = "test";</au-code>',
      class App {},
      [AuCodeCustomElement]
    );

    await startPromise;

    const copyButton = appHost.querySelector('au-code')?.shadowRoot?.querySelector('.copy-button');
    expect(copyButton).toBeDefined();

    await stop(true);
  });

  test('should copy text when copy button is clicked', async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-code copyable="true">const example = "test";</au-code>',
      class App {},
      [AuCodeCustomElement]
    );

    await startPromise;

    const copyButton = appHost.querySelector('au-code')?.shadowRoot?.querySelector('.copy-button') as HTMLButtonElement;
    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    copyButton?.click();

    expect(writeTextMock).toHaveBeenCalledWith('const example = "test";');

    await stop(true);
  });
});
