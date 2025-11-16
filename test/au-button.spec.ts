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
