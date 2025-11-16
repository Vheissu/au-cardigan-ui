import { createFixture } from "@aurelia/testing";
import { AuTextareaCustomElement } from "../src/components/au-textarea";
import { wait } from "./helpers";

describe("Textarea", () => {
  test("binds and updates value", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-textarea value.bind="bio"></au-textarea>',
      class App {
        public bio = "Hello";
      },
      [AuTextareaCustomElement]
    );

    await startPromise;
    await wait(0);

    const host = appHost.querySelector("au-textarea") as HTMLElement;
    const textarea = host?.shadowRoot?.querySelector("textarea") as HTMLTextAreaElement;

    expect(textarea.value).toEqual("Hello");

    textarea.value = "Updated";
    textarea.dispatchEvent(new Event("input"));
    await wait(0);

    expect(component.bio).toEqual("Updated");

    await stop(true);
  });

  test("applies rows and resize", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-textarea rows="5" resize="none"></au-textarea>',
      class App {},
      [AuTextareaCustomElement]
    );

    await startPromise;

    const textarea = appHost
      .querySelector("au-textarea")
      ?.shadowRoot?.querySelector("textarea");

    expect(textarea?.getAttribute("rows")).toEqual("5");
    expect(textarea?.classList.contains("none")).toBeTruthy();

    await stop(true);
  });
});
