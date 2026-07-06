import { createFixture } from "@aurelia/testing";
import { AuCalloutCustomElement } from "../src/components/au-callout";

describe("Callout", () => {
  test("renders body content with default info variant", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-callout>Something worth knowing</au-callout>",
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-callout");
    const callout = host?.shadowRoot?.querySelector(".callout");

    expect(callout).not.toBeNull();
    expect(callout?.classList.contains("info")).toBeTruthy();
    expect(host?.textContent).toContain("Something worth knowing");

    await stop(true);
  });

  test("applies the variant class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-callout variant="warning">Careful now</au-callout>',
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    const callout = appHost
      .querySelector("au-callout")
      ?.shadowRoot?.querySelector(".callout");

    expect(callout?.classList.contains("warning")).toBeTruthy();
    expect(callout?.classList.contains("info")).toBeFalsy();

    await stop(true);
  });

  test("renders heading when provided", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-callout heading="Heads up">Body text</au-callout>',
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    const heading = appHost
      .querySelector("au-callout")
      ?.shadowRoot?.querySelector(".heading");

    expect(heading?.textContent?.trim()).toEqual("Heads up");

    await stop(true);
  });

  test("omits heading and dismiss button by default", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-callout>Body text</au-callout>",
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    const root = appHost.querySelector("au-callout")?.shadowRoot;

    expect(root?.querySelector(".heading")).toBeNull();
    expect(root?.querySelector(".dismiss")).toBeNull();

    await stop(true);
  });

  test("dismiss hides the callout and dispatches dismissed event", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-callout dismissible.bind="true">Bye</au-callout>',
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-callout");
    const handler = jest.fn();
    host?.addEventListener("dismissed", handler);

    const dismissButton = host?.shadowRoot?.querySelector(
      ".dismiss"
    ) as HTMLButtonElement;
    expect(dismissButton).toBeDefined();
    expect(dismissButton.getAttribute("aria-label")).toEqual("Dismiss");

    dismissButton.dispatchEvent(new Event("click"));
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(host?.shadowRoot?.querySelector(".callout")).toBeNull();

    await stop(true);
  });

  test("dismissed event bubbles and composes", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-callout dismissible.bind="true">Bye</au-callout>',
      class App {},
      [AuCalloutCustomElement]
    );

    await startPromise;

    let receivedEvent: Event | undefined;
    appHost.addEventListener("dismissed", (event) => {
      receivedEvent = event;
    });

    const dismissButton = appHost
      .querySelector("au-callout")
      ?.shadowRoot?.querySelector(".dismiss") as HTMLButtonElement;

    dismissButton.dispatchEvent(new Event("click"));
    await Promise.resolve();

    expect(receivedEvent).toBeDefined();
    expect(receivedEvent?.bubbles).toBeTruthy();
    expect(receivedEvent?.composed).toBeTruthy();

    await stop(true);
  });
});
