import { createFixture } from "@aurelia/testing";
import { AuCheckboxGroupCustomElement } from "../src/components/au-checkbox-group";
import { AuCheckboxCustomElement } from "../src/components/au-checkbox";

describe("Checkbox group", () => {
  const template = `
    <au-checkbox-group label="Fruits" value.bind="selected">
      <au-checkbox label="Apple" value="apple"></au-checkbox>
      <au-checkbox label="Banana" value="banana"></au-checkbox>
    </au-checkbox-group>
  `;

  test("recomputes value and dispatches change when a child toggles", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      template,
      class App {
        public selected: string[] = [];
      },
      [AuCheckboxGroupCustomElement, AuCheckboxCustomElement]
    );

    await startPromise;

    const group = appHost.querySelector("au-checkbox-group");
    const events: string[][] = [];
    group?.addEventListener("change", event =>
      events.push((event as CustomEvent<{ value: string[] }>).detail.value)
    );

    const inputs = appHost.querySelectorAll("au-checkbox");
    const apple = inputs[0]?.shadowRoot?.querySelector("input") as HTMLInputElement;
    apple.click();
    await Promise.resolve();

    expect(component.selected).toEqual(["apple"]);
    expect(events).toEqual([["apple"]]);

    const banana = inputs[1]?.shadowRoot?.querySelector("input") as HTMLInputElement;
    banana.click();
    await Promise.resolve();

    expect(component.selected).toEqual(["apple", "banana"]);

    apple.click();
    await Promise.resolve();

    expect(component.selected).toEqual(["banana"]);

    await stop(true);
  });

  test("checks children when value is set from outside", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      template,
      class App {
        public selected: string[] = ["banana"];
      },
      [AuCheckboxGroupCustomElement, AuCheckboxCustomElement]
    );

    await startPromise;

    const inputs = appHost.querySelectorAll("au-checkbox");
    const apple = inputs[0]?.shadowRoot?.querySelector("input") as HTMLInputElement;
    const banana = inputs[1]?.shadowRoot?.querySelector("input") as HTMLInputElement;

    expect(apple.checked).toBe(false);
    expect(banana.checked).toBe(true);

    component.selected = ["apple"];
    await Promise.resolve();

    expect(apple.checked).toBe(true);
    expect(banana.checked).toBe(false);

    await stop(true);
  });

  test("propagates disabled to children", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-checkbox-group label="Fruits" disabled.bind="true">
          <au-checkbox label="Apple" value="apple"></au-checkbox>
        </au-checkbox-group>
      `,
      class App {},
      [AuCheckboxGroupCustomElement, AuCheckboxCustomElement]
    );

    await startPromise;

    const apple = appHost
      .querySelector("au-checkbox")
      ?.shadowRoot?.querySelector("input") as HTMLInputElement;

    expect(apple.disabled).toBe(true);

    await stop(true);
  });

  test("renders legend, helper and orientation class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-checkbox-group label="Fruits" orientation="horizontal" helper="Pick some">
          <au-checkbox label="Apple" value="apple"></au-checkbox>
        </au-checkbox-group>
      `,
      class App {},
      [AuCheckboxGroupCustomElement, AuCheckboxCustomElement]
    );

    await startPromise;

    const shadow = appHost.querySelector("au-checkbox-group")?.shadowRoot;

    expect(shadow?.querySelector("legend")?.textContent?.trim()).toBe("Fruits");
    expect(shadow?.querySelector("fieldset")?.className).toContain("horizontal");
    expect(shadow?.querySelector(".message.helper")?.textContent?.trim()).toBe("Pick some");

    await stop(true);
  });
});
