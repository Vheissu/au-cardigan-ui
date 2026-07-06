import { createFixture } from "@aurelia/testing";
import { AuButtonGroupCustomElement } from "../src/components/au-button-group";
import { AuButtonCustomElement } from "../src/components/au-button";

describe("ButtonGroup", () => {
  test("renders role=group container with slotted buttons", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-button-group>
          <au-button>One</au-button>
          <au-button>Two</au-button>
          <au-button>Three</au-button>
        </au-button-group>
      `,
      class App {},
      [AuButtonGroupCustomElement, AuButtonCustomElement]
    );

    await startPromise;

    const group = appHost
      .querySelector("au-button-group")
      ?.shadowRoot?.querySelector(".group");

    expect(group).toBeDefined();
    expect(group?.getAttribute("role")).toEqual("group");
    expect(group?.classList.contains("horizontal")).toBeTruthy();
    expect(appHost.querySelectorAll("au-button-group au-button").length).toBe(3);

    await stop(true);
  });

  test("does not render aria-label when not provided", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-button-group></au-button-group>",
      class App {},
      [AuButtonGroupCustomElement]
    );

    await startPromise;

    const group = appHost
      .querySelector("au-button-group")
      ?.shadowRoot?.querySelector(".group");

    expect(group?.hasAttribute("aria-label")).toBeFalsy();

    await stop(true);
  });

  test("sets aria-label when provided", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button-group aria-label="Text alignment"></au-button-group>',
      class App {},
      [AuButtonGroupCustomElement]
    );

    await startPromise;

    const group = appHost
      .querySelector("au-button-group")
      ?.shadowRoot?.querySelector(".group");

    expect(group?.getAttribute("aria-label")).toEqual("Text alignment");

    await stop(true);
  });

  test("applies vertical orientation class", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-button-group orientation="vertical"></au-button-group>',
      class App {},
      [AuButtonGroupCustomElement]
    );

    await startPromise;

    const group = appHost
      .querySelector("au-button-group")
      ?.shadowRoot?.querySelector(".group");

    expect(group?.classList.contains("vertical")).toBeTruthy();
    expect(group?.classList.contains("horizontal")).toBeFalsy();

    await stop(true);
  });
});
