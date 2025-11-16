import { createFixture } from "@aurelia/testing";
import { AuInputCustomElement } from "../src/components/au-input";
import { wait } from "./helpers";

describe("Input", () => {
  test("binds initial value", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-input value.bind="username"></au-input>',
      class App {
        public username = "Cardigan";
      },
      [AuInputCustomElement]
    );

    await startPromise;
    await wait(0);

    const host = appHost.querySelector("au-input") as HTMLElement;
    const input = host?.shadowRoot?.querySelector("input");
    expect(input?.value).toEqual("Cardigan");

    await stop(true);
  });

  test("updates value from user interaction", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-input value.bind="username"></au-input>',
      class App {
        public username = "";
      },
      [AuInputCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-input") as HTMLElement;
    const input = host?.shadowRoot?.querySelector("input") as HTMLInputElement;

    input.value = "Hello";
    input.dispatchEvent(new Event("input"));
    await wait(0);

    expect(component.username).toEqual("Hello");

    await stop(true);
  });

  test("shows label and helper text", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-input label="Email" helper="We never share your email"></au-input>',
      class App {},
      [AuInputCustomElement]
    );

    await startPromise;

    const host = appHost.querySelector("au-input")?.shadowRoot;

    expect(host?.querySelector(".label")?.textContent?.trim()).toContain("Email");
    expect(host?.querySelector(".message.helper")?.textContent?.trim()).toContain(
      "We never share your email"
    );

    await stop(true);
  });
});
