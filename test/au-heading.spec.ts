import { createFixture } from "@aurelia/testing";
import { CustomElement } from "@aurelia/runtime-html";
import { AuHeadingCustomElement } from "./../src/components/au-heading";

describe("Heading", () => {
  test("should render heading element without passing properties", async () => {
    const app = CustomElement.define({
      name: "app",
      template: "<au-heading>My heading</au-heading>",
    });

    const { appHost, stop } = await createFixture(
      "<au-heading>My heading</au-heading>",
      {},
      [AuHeadingCustomElement]
    );

    const componentHtml =
    appHost.querySelector("au-heading")?.shadowRoot?.innerHTML;

    expect(componentHtml).toContain("<h1");
    expect(componentHtml).not.toContain("<h2");

    await stop(true);
  });

  test.each([2, 3, 4, 5, 6])("should render h%s element", async (level) => {
    const { appHost, stop } = await createFixture(
      `<au-heading level="${level}">My heading</au-heading>`,
      {},
      [AuHeadingCustomElement]
    );

    const componentHtml =
    appHost.querySelector("au-heading")?.shadowRoot?.innerHTML;

    expect(componentHtml).toContain(`<h${level}`);
    expect(componentHtml).not.toContain("<h1");

    await stop(true);
  });

  test("invalid level value has been provided, so the heading defaults to a h1", async () => {
    const { appHost, stop } = await createFixture(
      '<au-heading level="12">My heading</au-heading>',
      {},
      [AuHeadingCustomElement]
    );

    const componentHtml =
    appHost.querySelector("au-heading")?.shadowRoot?.innerHTML;

    expect(componentHtml).toContain("<h1");

    await stop(true);
  });

  test("truncate adds truncate class", async () => {
    const ViewModel = class Viewmodel {
      truncate = true;
    };

    const { appHost, stop } = await createFixture(
      '<au-heading truncate.bind="truncate">My heading</au-heading>',
      ViewModel,
      [AuHeadingCustomElement]
    );

    const component = appHost.querySelector("au-heading")?.shadowRoot;

    expect(component?.querySelectorAll(".truncate")).toHaveLength(1);

    await stop(true);
  });
});
