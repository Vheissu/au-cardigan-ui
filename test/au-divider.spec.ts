import { createFixture } from "@aurelia/testing";
import { AuDividerCustomElement } from "../src/components/au-divider";

describe("Divider", () => {
  test("renders a horizontal divider by default", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-divider></au-divider>",
      class App {},
      [AuDividerCustomElement]
    );

    await startPromise;

    const divider = appHost
      .querySelector("au-divider")
      ?.shadowRoot?.querySelector(".divider");

    expect(divider).not.toBeNull();
    expect(divider?.classList.contains("horizontal")).toBeTruthy();
    expect(divider?.getAttribute("role")).toEqual("separator");
    expect(divider?.hasAttribute("aria-orientation")).toBeFalsy();

    await stop(true);
  });

  test("supports vertical orientation", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-divider orientation="vertical"></au-divider>',
      class App {},
      [AuDividerCustomElement]
    );

    await startPromise;

    const divider = appHost
      .querySelector("au-divider")
      ?.shadowRoot?.querySelector(".divider");

    expect(divider?.classList.contains("vertical")).toBeTruthy();
    expect(divider?.getAttribute("aria-orientation")).toEqual("vertical");

    await stop(true);
  });

  test("renders label text in the middle of the line", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-divider label="or"></au-divider>',
      class App {},
      [AuDividerCustomElement]
    );

    await startPromise;

    const root = appHost.querySelector("au-divider")?.shadowRoot;
    const divider = root?.querySelector(".divider");

    expect(divider?.classList.contains("has-label")).toBeTruthy();
    expect(root?.querySelector(".label")?.textContent?.trim()).toEqual("or");

    await stop(true);
  });

  test("omits label element when no label is provided", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-divider></au-divider>",
      class App {},
      [AuDividerCustomElement]
    );

    await startPromise;

    const root = appHost.querySelector("au-divider")?.shadowRoot;

    expect(root?.querySelector(".label")).toBeNull();
    expect(root?.querySelector(".divider")?.classList.contains("has-label")).toBeFalsy();

    await stop(true);
  });

  test("label updates when bindable changes", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-divider label.bind="text"></au-divider>',
      class App {
        public text = "before";
      },
      [AuDividerCustomElement]
    );

    await startPromise;

    component.text = "after";
    await Promise.resolve();

    const label = appHost
      .querySelector("au-divider")
      ?.shadowRoot?.querySelector(".label");

    expect(label?.textContent?.trim()).toEqual("after");

    await stop(true);
  });
});
