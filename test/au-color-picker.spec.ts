import { createFixture } from "@aurelia/testing";
import { AuColorPickerCustomElement } from "../src/components/au-color-picker";

describe("Color picker", () => {
  test("renders default swatches with aria labels", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-color-picker label='Brand color'></au-color-picker>",
      class App {},
      [AuColorPickerCustomElement]
    );

    await startPromise;

    const shadow = appHost.querySelector("au-color-picker")?.shadowRoot;
    const swatches = shadow?.querySelectorAll(".swatch");

    expect(swatches?.length).toBeGreaterThanOrEqual(5);
    expect(swatches?.[0]?.getAttribute("aria-label")).toBe("#0466C8");
    expect(swatches?.[0]?.getAttribute("aria-pressed")).toBe("true");

    await stop(true);
  });

  test("selecting a swatch updates value and dispatches change", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-color-picker value.bind='color'></au-color-picker>",
      class App {
        public color = "#0466C8";
      },
      [AuColorPickerCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-color-picker");
    const events: string[] = [];
    host?.addEventListener("change", event =>
      events.push((event as CustomEvent<{ value: string }>).detail.value)
    );

    const shadow = host?.shadowRoot;
    const swatch = shadow?.querySelectorAll(".swatch")[2] as HTMLButtonElement;
    swatch.click();
    await Promise.resolve();

    expect(component.color).toBe("#FF6B6B");
    expect(events).toEqual(["#FF6B6B"]);
    expect(swatch.getAttribute("aria-pressed")).toBe("true");

    await stop(true);
  });

  test("valid hex text input updates value", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-color-picker value.bind='color'></au-color-picker>",
      class App {
        public color = "#0466C8";
      },
      [AuColorPickerCustomElement]
    );

    await startPromise;

    const hexInput = appHost
      .querySelector("au-color-picker")
      ?.shadowRoot?.querySelector(".hex-input") as HTMLInputElement;

    hexInput.value = "#ff0000";
    hexInput.dispatchEvent(new Event("change"));
    await Promise.resolve();

    expect(component.color).toBe("#ff0000");

    hexInput.value = "#abc";
    hexInput.dispatchEvent(new Event("change"));
    await Promise.resolve();

    expect(component.color).toBe("#abc");

    await stop(true);
  });

  test("invalid hex input does not update value and reverts the field", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      "<au-color-picker value.bind='color'></au-color-picker>",
      class App {
        public color = "#0466C8";
      },
      [AuColorPickerCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-color-picker");
    const events: unknown[] = [];
    host?.addEventListener("change", event => events.push(event));

    const hexInput = host?.shadowRoot?.querySelector(".hex-input") as HTMLInputElement;
    hexInput.value = "tomato";
    hexInput.dispatchEvent(new Event("change"));
    await Promise.resolve();

    expect(component.color).toBe("#0466C8");
    expect(hexInput.value).toBe("#0466C8");
    expect(events.length).toBe(0);

    await stop(true);
  });

  test("hides hex input when showInput is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-color-picker show-input.bind='false'></au-color-picker>",
      class App {},
      [AuColorPickerCustomElement]
    );

    await startPromise;

    const shadow = appHost.querySelector("au-color-picker")?.shadowRoot;
    expect(shadow?.querySelector(".hex-input")).toBeNull();

    await stop(true);
  });
});
