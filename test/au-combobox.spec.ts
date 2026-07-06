import { createFixture } from "@aurelia/testing";
import { AuComboboxCustomElement } from "../src/components/au-combobox";

describe("Combobox", () => {
  function getParts(appHost: Element) {
    const shadow = appHost.querySelector("au-combobox")?.shadowRoot;
    const input = shadow?.querySelector("input") as HTMLInputElement;
    return { shadow, input };
  }

  function type(input: HTMLInputElement, text: string) {
    input.value = text;
    input.dispatchEvent(new Event("input"));
  }

  function press(input: HTMLInputElement, key: string) {
    input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  }

  test("filters options case-insensitively as the user types", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits'></au-combobox>",
      class App {
        public fruits = ["Apple", "Banana", "Blueberry"];
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { shadow, input } = getParts(appHost);

    type(input, "b");
    await Promise.resolve();

    let options = shadow?.querySelectorAll('[role="option"]');
    expect(options?.length).toBe(2);
    expect(input.getAttribute("aria-expanded")).toBe("true");

    type(input, "blue");
    await Promise.resolve();

    options = shadow?.querySelectorAll('[role="option"]');
    expect(options?.length).toBe(1);
    expect(options?.[0]?.textContent?.trim()).toBe("Blueberry");

    await stop(true);
  });

  test("keyboard navigation selects an option and dispatches change", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits' value.bind='fruit'></au-combobox>",
      class App {
        public fruits = ["Apple", "Banana", "Blueberry"];
        public fruit = "";
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-combobox");
    const events: string[] = [];
    host?.addEventListener("change", event =>
      events.push((event as CustomEvent<{ value: string }>).detail.value)
    );

    const { shadow, input } = getParts(appHost);

    press(input, "ArrowDown");
    await Promise.resolve();

    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-activedescendant")).toContain("-option-0");

    press(input, "ArrowDown");
    await Promise.resolve();

    const highlighted = shadow?.querySelector(".option.is-highlighted");
    expect(highlighted?.textContent?.trim()).toBe("Banana");

    press(input, "Enter");
    await Promise.resolve();

    expect(component.fruit).toBe("Banana");
    expect(events).toEqual(["Banana"]);
    expect(input.value).toBe("Banana");
    expect(shadow?.querySelector('[role="listbox"]')).toBeNull();

    await stop(true);
  });

  test("supports object options and sets input text to the label", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='countries' value.bind='country'></au-combobox>",
      class App {
        public countries = [
          { value: "au", label: "Australia" },
          { value: "nz", label: "New Zealand" }
        ];
        public country = "";
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { shadow, input } = getParts(appHost);

    type(input, "zeal");
    await Promise.resolve();

    const option = shadow?.querySelector('[role="option"]') as HTMLElement;
    expect(option?.textContent?.trim()).toBe("New Zealand");

    option.click();
    await Promise.resolve();

    expect(component.country).toBe("nz");
    expect(input.value).toBe("New Zealand");

    await stop(true);
  });

  test("escape closes the listbox", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits'></au-combobox>",
      class App {
        public fruits = ["Apple", "Banana"];
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { shadow, input } = getParts(appHost);

    type(input, "a");
    await Promise.resolve();
    expect(shadow?.querySelector('[role="listbox"]')).not.toBeNull();

    press(input, "Escape");
    await Promise.resolve();

    expect(shadow?.querySelector('[role="listbox"]')).toBeNull();
    expect(input.getAttribute("aria-expanded")).toBe("false");

    await stop(true);
  });

  test("shows noResultsText when nothing matches", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits' no-results-text='Nothing here'></au-combobox>",
      class App {
        public fruits = ["Apple"];
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { shadow, input } = getParts(appHost);

    type(input, "zzz");
    await Promise.resolve();

    expect(shadow?.querySelector(".no-results")?.textContent?.trim()).toBe("Nothing here");

    await stop(true);
  });

  test("freeText commits values not present in options", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits' value.bind='fruit' free-text.bind='true'></au-combobox>",
      class App {
        public fruits = ["Apple"];
        public fruit = "";
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { input } = getParts(appHost);

    type(input, "Dragonfruit");
    await Promise.resolve();
    press(input, "Enter");
    await Promise.resolve();

    expect(component.fruit).toBe("Dragonfruit");

    await stop(true);
  });

  test("without freeText, typed values are not committed", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-combobox options.bind='fruits' value.bind='fruit'></au-combobox>",
      class App {
        public fruits = ["Apple"];
        public fruit = "";
      },
      [AuComboboxCustomElement]
    );

    await startPromise;

    const { input } = getParts(appHost);

    type(input, "Dragonfruit");
    await Promise.resolve();
    press(input, "Enter");
    await Promise.resolve();

    expect(component.fruit).toBe("");

    await stop(true);
  });
});
