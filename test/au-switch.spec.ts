import { createFixture } from "@aurelia/testing";
import { AuSwitchCustomElement } from "../src/components/au-switch";

describe("Switch", () => {
  test("binds checked state", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-switch checked.bind="enabled" label="Dark Mode"></au-switch>',
      class App {
        public enabled = false;
      },
      [AuSwitchCustomElement]
    );

    await startPromise;

    const toggle = appHost
      .querySelector("au-switch")
      ?.shadowRoot?.querySelector("input") as HTMLInputElement;

    toggle.click();

    expect(component.enabled).toBeTruthy();

    await stop(true);
  });

  test("applies size class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-switch size="large" label="Power"></au-switch>',
      class App {},
      [AuSwitchCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-switch")?.shadowRoot?.querySelector(".field");
    expect(host?.classList.contains("large")).toBeTruthy();

    await stop(true);
  });
});
