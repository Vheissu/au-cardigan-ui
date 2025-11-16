import { createFixture } from "@aurelia/testing";
import { AuSelectCustomElement } from "./../src/components/au-select";

describe("Select", () => {
  test("should render select element", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-select></au-select>",
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    expect(select).toBeDefined();

    await stop(true);
  });

  test("should render select with options passed as content", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `<au-select>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </au-select>`,
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    const options = select?.querySelectorAll("option");

    expect(options).toHaveLength(3);
    expect(options?.[0].textContent?.trim()).toBe("Select an option");
    expect(options?.[1].textContent?.trim()).toBe("Option 1");
    expect(options?.[2].textContent?.trim()).toBe("Option 2");

    await stop(true);
  });

  test("should render select with options passed as property", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select options.bind="options"></au-select>',
      class App {
        options = [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ];
      },
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    const options = select?.querySelectorAll("option");

    expect(options).toHaveLength(3); // Including the placeholder option
    expect(options?.[0].textContent?.trim()).toBe("Select an option");
    expect(options?.[1].textContent?.trim()).toBe("Option 1");
    expect(options?.[2].textContent?.trim()).toBe("Option 2");

    await stop(true);
  });

  test("should set placeholder", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select placeholder="Select an option"></au-select>',
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const placeholderOption = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("option[disabled][selected]");

    expect(placeholderOption?.textContent?.trim()).toBe("Select an option");

    await stop(true);
  });

  test("should set size class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select size="large"></au-select>',
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const selectWrapper = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector(".select-wrapper");

    expect(selectWrapper?.classList.contains("large")).toBeTruthy();

    await stop(true);
  });

  test("should set disabled attribute", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select disabled="true"></au-select>',
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    expect(select?.hasAttribute("disabled")).toBeTruthy();

    await stop(true);
  });

  test("should set required attribute", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select required="true"></au-select>',
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    expect(select?.hasAttribute("required")).toBeTruthy();

    await stop(true);
  });

  test("should set multiple attribute", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-select multiple="true"></au-select>',
      class App {},
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select");

    expect(select?.hasAttribute("multiple")).toBeTruthy();

    await stop(true);
  });

  test("should bind value", async () => {
    const { appHost, startPromise, stop, component } = await createFixture(
      '<au-select value.bind="selectedValue" options.bind="options"></au-select>',
      class App {
        selectedValue = "2";
        options = [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ];
      },
      [AuSelectCustomElement]
    );

    await startPromise;

    const select = appHost
      .querySelector("au-select")
      ?.shadowRoot?.querySelector("select") as HTMLSelectElement;

    expect(select?.value).toBe("2");

    await stop(true);
  });
});
