import { createFixture } from "@aurelia/testing";
import { AuCheckboxCustomElement } from "../src/components/au-checkbox";

describe("Checkbox", () => {
  test("toggles checked binding", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-checkbox checked.bind="active" label="Accept"></au-checkbox>',
      class App {
        public active = false;
      },
      [AuCheckboxCustomElement]
    );

    await startPromise;

    const checkbox = appHost
      .querySelector("au-checkbox")
      ?.shadowRoot?.querySelector("input") as HTMLInputElement;

    checkbox.click();

    expect(component.active).toBeTruthy();

    await stop(true);
  });

  test("shows description text", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-checkbox label="Updates" description="Email me releases"></au-checkbox>',
      class App {},
      [AuCheckboxCustomElement]
    );

    await startPromise;

    const description = appHost
      .querySelector("au-checkbox")
      ?.shadowRoot?.querySelector(".description")?.textContent?.trim();

    expect(description).toEqual("Email me releases");

    await stop(true);
  });
});
