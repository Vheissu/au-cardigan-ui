import { createFixture } from "@aurelia/testing";
import { AuCopyButtonCustomElement } from "../src/components/au-copy-button";

function mockClipboard(writeText: jest.Mock) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true
  });
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("Copy button", () => {
  afterEach(() => {
    delete (navigator as unknown as { clipboard?: unknown }).clipboard;
  });

  test("copies the value bindable via navigator.clipboard", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { appHost, startPromise, stop } = await createFixture(
      "<au-copy-button value='hello world'></au-copy-button>",
      class App {},
      [AuCopyButtonCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-copy-button");
    const events: string[] = [];
    host?.addEventListener("copied", event =>
      events.push((event as CustomEvent<{ value: string }>).detail.value)
    );

    const button = host?.shadowRoot?.querySelector("button") as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe("Copy");

    button.click();
    await flush();

    expect(writeText).toHaveBeenCalledWith("hello world");
    expect(events).toEqual(["hello world"]);
    expect(button.textContent?.trim()).toBe("Copied!");
    expect(button.hasAttribute("data-copied")).toBe(true);

    await stop(true);
  });

  test("copies textContent of the element matched by the for selector", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { appHost, startPromise, stop } = await createFixture(
      `
        <p id="copy-source">Some source text</p>
        <au-copy-button for="#copy-source"></au-copy-button>
      `,
      class App {},
      [AuCopyButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-copy-button")
      ?.shadowRoot?.querySelector("button") as HTMLButtonElement;

    button.click();
    await flush();

    expect(writeText).toHaveBeenCalledWith("Some source text");

    await stop(true);
  });

  test("reverts to the idle label after resetDelay", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { appHost, startPromise, stop } = await createFixture(
      "<au-copy-button value='x' reset-delay='20'></au-copy-button>",
      class App {},
      [AuCopyButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-copy-button")
      ?.shadowRoot?.querySelector("button") as HTMLButtonElement;

    button.click();
    await flush();
    expect(button.textContent?.trim()).toBe("Copied!");

    await new Promise(resolve => setTimeout(resolve, 60));

    expect(button.textContent?.trim()).toBe("Copy");
    expect(button.hasAttribute("data-copied")).toBe(false);

    await stop(true);
  });

  test("dispatches copy-error when the clipboard write fails", async () => {
    const writeText = jest.fn().mockRejectedValue(new Error("denied"));
    mockClipboard(writeText);

    const { appHost, startPromise, stop } = await createFixture(
      "<au-copy-button value='x'></au-copy-button>",
      class App {},
      [AuCopyButtonCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-copy-button");
    const errors: unknown[] = [];
    host?.addEventListener("copy-error", event => errors.push((event as CustomEvent).detail.error));

    const button = host?.shadowRoot?.querySelector("button") as HTMLButtonElement;
    button.click();
    await flush();

    expect(errors.length).toBe(1);
    expect(button.textContent?.trim()).toBe("Copy");
    expect(button.hasAttribute("data-copied")).toBe(false);

    await stop(true);
  });

  test("uses custom labels", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { appHost, startPromise, stop } = await createFixture(
      "<au-copy-button value='x' label='Copy link' copied-label='Link copied'></au-copy-button>",
      class App {},
      [AuCopyButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-copy-button")
      ?.shadowRoot?.querySelector("button") as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe("Copy link");

    button.click();
    await flush();

    expect(button.textContent?.trim()).toBe("Link copied");

    await stop(true);
  });
});
