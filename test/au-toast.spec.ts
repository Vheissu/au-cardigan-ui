import { createFixture } from "@aurelia/testing";
import { AuToastCustomElement } from "./../src/components/au-toast";

describe("Toast", () => {
  test("renders title, message and type class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-toast type="success" title="Saved" message="All changes stored"></au-toast>',
      class App {},
      [AuToastCustomElement]
    );

    await startPromise;

    const root = appHost.querySelector("au-toast")?.shadowRoot;
    expect(root?.querySelector(".toast")?.classList.contains("success")).toBe(true);
    expect(root?.querySelector(".toast-title")?.textContent).toContain("Saved");
    expect(root?.querySelector(".toast-message")?.textContent).toContain("All changes stored");
    expect(root?.querySelector(".toast")?.getAttribute("role")).toEqual("status");

    await stop(true);
  });

  test("dismiss button dispatches toast-dismiss with the toast id", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-toast toast-id="t-1" message="Bye"></au-toast>',
      class App {},
      [AuToastCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-toast");
    const handler = jest.fn();
    host?.addEventListener("toast-dismiss", handler);

    const dismiss = host?.shadowRoot?.querySelector<HTMLButtonElement>(".toast-dismiss");
    dismiss?.click();

    expect(handler).toBeCalled();
    expect(handler.mock.calls[0][0].detail).toEqual({ id: "t-1" });

    await stop(true);
  });

  test("hides dismiss button when not dismissible", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-toast dismissible.bind="false" message="Sticky"></au-toast>',
      class App {},
      [AuToastCustomElement]
    );

    await startPromise;

    const root = appHost.querySelector("au-toast")?.shadowRoot;
    expect(root?.querySelector(".toast-dismiss")).toBeNull();

    await stop(true);
  });

  test("action button invokes callback and dispatches toast-action", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-toast toast-id="t-2" action-label="Undo" action-callback.bind="onAction"></au-toast>',
      class App {
        onAction = jest.fn();
      },
      [AuToastCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-toast");
    const handler = jest.fn();
    host?.addEventListener("toast-action", handler);

    const action = host?.shadowRoot?.querySelector<HTMLButtonElement>(".toast-action");
    expect(action?.textContent).toContain("Undo");
    action?.click();

    expect(component.onAction).toBeCalled();
    expect(handler).toBeCalled();
    expect(handler.mock.calls[0][0].detail).toEqual({ id: "t-2" });

    await stop(true);
  });
});
