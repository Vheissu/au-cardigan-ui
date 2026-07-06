import { createFixture } from "@aurelia/testing";
import { AuBreadcrumbCustomElement } from "../src/components/au-breadcrumb";
import { AuBreadcrumbItemCustomElement } from "../src/components/au-breadcrumb-item";

describe("Breadcrumb", () => {
  const template = `
    <au-breadcrumb>
      <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
      <au-breadcrumb-item href="/docs">Docs</au-breadcrumb-item>
      <au-breadcrumb-item>Current page</au-breadcrumb-item>
    </au-breadcrumb>
  `;

  test("renders nav with default aria-label", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;

    const nav = appHost
      .querySelector("au-breadcrumb")
      ?.shadowRoot?.querySelector("nav");

    expect(nav).toBeDefined();
    expect(nav?.getAttribute("aria-label")).toEqual("breadcrumb");
    expect(nav?.querySelector("ol")).not.toBeNull();

    await stop(true);
  });

  test("uses custom aria-label", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-breadcrumb aria-label="You are here"></au-breadcrumb>',
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;

    const nav = appHost
      .querySelector("au-breadcrumb")
      ?.shadowRoot?.querySelector("nav");

    expect(nav?.getAttribute("aria-label")).toEqual("You are here");

    await stop(true);
  });

  test("renders link when href is set and span otherwise", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;
    await Promise.resolve();

    const items = appHost.querySelectorAll("au-breadcrumb-item");

    const firstLink = items[0]?.shadowRoot?.querySelector("a");
    expect(firstLink).not.toBeNull();
    expect(firstLink?.getAttribute("href")).toEqual("/");

    const lastItem = items[2]?.shadowRoot;
    expect(lastItem?.querySelector("a")).toBeNull();
    expect(lastItem?.querySelector(".label")).not.toBeNull();

    await stop(true);
  });

  test("marks last item with aria-current and hides its separator", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;
    await Promise.resolve();

    const items = appHost.querySelectorAll("au-breadcrumb-item");

    expect(
      items[0]?.shadowRoot?.querySelector("a")?.hasAttribute("aria-current")
    ).toBeFalsy();
    expect(items[0]?.shadowRoot?.querySelector(".separator")).not.toBeNull();
    expect(items[1]?.shadowRoot?.querySelector(".separator")).not.toBeNull();

    const last = items[2]?.shadowRoot;
    expect(last?.querySelector(".label")?.getAttribute("aria-current")).toEqual(
      "page"
    );
    expect(last?.querySelector(".separator")).toBeNull();

    await stop(true);
  });

  test("propagates custom separator to items", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-breadcrumb separator=">">
          <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
          <au-breadcrumb-item>Docs</au-breadcrumb-item>
        </au-breadcrumb>
      `,
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;
    await Promise.resolve();

    const separator = appHost
      .querySelector("au-breadcrumb-item")
      ?.shadowRoot?.querySelector(".separator");

    expect(separator?.textContent?.trim()).toEqual(">");
    expect(separator?.getAttribute("aria-hidden")).toEqual("true");

    await stop(true);
  });

  test("updates items when separator changes", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      `
        <au-breadcrumb separator.bind="sep">
          <au-breadcrumb-item href="/">Home</au-breadcrumb-item>
          <au-breadcrumb-item>Docs</au-breadcrumb-item>
        </au-breadcrumb>
      `,
      class App {
        public sep = "/";
      },
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;
    await Promise.resolve();

    component.sep = "•";
    await Promise.resolve();

    const separator = appHost
      .querySelector("au-breadcrumb-item")
      ?.shadowRoot?.querySelector(".separator");

    expect(separator?.textContent?.trim()).toEqual("•");

    await stop(true);
  });

  test("supports explicit current on a non-last item", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-breadcrumb>
          <au-breadcrumb-item href="/" current.bind="true">Home</au-breadcrumb-item>
          <au-breadcrumb-item>Docs</au-breadcrumb-item>
        </au-breadcrumb>
      `,
      class App {},
      [AuBreadcrumbCustomElement, AuBreadcrumbItemCustomElement]
    );

    await startPromise;
    await Promise.resolve();

    const first = appHost
      .querySelector("au-breadcrumb-item")
      ?.shadowRoot?.querySelector("a");

    expect(first?.getAttribute("aria-current")).toEqual("page");

    await stop(true);
  });
});
