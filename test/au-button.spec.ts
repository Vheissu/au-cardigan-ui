import { createFixture } from "@aurelia/testing";
import { AuButtonCustomElement } from "./../src/components/au-button";

describe("Button", () => {
  test("should render button", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-button>Click me</au-button>",
      class App {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button).toBeDefined();

    await stop(true);
  });

  test("should render submit button", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button type="submit">Click me</au-button>',
      class App {
        type = "submit";
      },
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.getAttribute("type")).toEqual("submit");

    await stop(true);
  });

  test("should set button title", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button title="Test Button">Click me</au-button>',
      {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.getAttribute("title")).toEqual("Test Button");

    await stop(true);
  });

  test("should set button colour", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button color="red">Click me</au-button>',
      {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.classList.contains("red")).toBeTruthy();

    await stop(true);
  });

  test("should set button size", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button size="medium">Click me</au-button>',
      {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.classList.contains("medium")).toBeTruthy();

    await stop(true);
  });

  test("button clicked triggers callback", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-button callback.bind="() => myButtonEvent()">Click me</au-button>',
      class App {
        myButtonEvent = jest.fn();
      },
      [AuButtonCustomElement]
    );

    await startPromise;

    jest.spyOn(component, "myButtonEvent");

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");
    button?.dispatchEvent(new Event("click"));

    expect(component.myButtonEvent).toBeCalled();

    await stop(true);
  });

  test("loading button shows spinner, disables button and sets aria-busy", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button loading.bind="true">Click me</au-button>',
      class App {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute("aria-busy")).toEqual("true");
    expect(button?.querySelector(".spinner")).not.toBeNull();

    await stop(true);
  });

  test("disabled button does not invoke callback", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-button disabled.bind="true" callback.bind="() => myButtonEvent()">Click me</au-button>',
      class App {
        myButtonEvent = jest.fn();
      },
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");
    button?.dispatchEvent(new Event("click"));

    expect(component.myButtonEvent).not.toBeCalled();

    await stop(true);
  });

  test("applies variant class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button variant="outline" color="primary">Click me</au-button>',
      class App {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.classList.contains("variant-outline")).toBeTruthy();

    await stop(true);
  });

  test("full-width button applies class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button full-width.bind="true">Click me</au-button>',
      class App {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");

    expect(button?.classList.contains("is-full-width")).toBeTruthy();

    await stop(true);
  });

  test("dispatches au-button-click event on the host", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-button>Click me</au-button>",
      class App {},
      [AuButtonCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-button");
    const handler = jest.fn();
    host?.addEventListener("au-button-click", handler);

    host?.shadowRoot?.querySelector("button")?.dispatchEvent(new Event("click"));

    expect(handler).toBeCalled();

    await stop(true);
  });

  test("button clicked without providing callback", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-button>Click me</au-button>",
      class App {
        myButtonEvent = jest.fn();
      },
      [AuButtonCustomElement]
    );

    await startPromise;

    jest.spyOn(component, "myButtonEvent");

    const button = appHost
      .querySelector("au-button")
      ?.shadowRoot?.querySelector("button");
    button?.dispatchEvent(new Event("click"));

    expect(component.myButtonEvent).not.toBeCalled();

    await stop(true);
  });
});
