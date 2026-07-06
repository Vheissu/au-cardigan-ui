import { createFixture } from "@aurelia/testing";
import { CustomElement } from "@aurelia/runtime-html";
import { AuCarouselCustomElement } from "./../src/components/au-carousel";
import { AuCarouselItemCustomElement } from "./../src/components/au-carousel-item";

describe("Carousel", () => {
  const dependencies = [AuCarouselCustomElement, AuCarouselItemCustomElement];
  const template = `
    <au-carousel>
      <au-carousel-item label="First slide">One</au-carousel-item>
      <au-carousel-item>Two</au-carousel-item>
      <au-carousel-item>Three</au-carousel-item>
    </au-carousel>
  `;

  function getViewModel(appHost: Element): AuCarouselCustomElement {
    const element = appHost.querySelector("au-carousel") as Element;
    return CustomElement.for(element).viewModel as AuCarouselCustomElement;
  }

  test("applies slide semantics to items", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const region = appHost.querySelector("au-carousel")?.shadowRoot?.querySelector(".carousel");
    expect(region?.getAttribute("aria-roledescription")).toEqual("carousel");

    const items = appHost.querySelectorAll("au-carousel-item");
    expect(items.length).toBe(3);
    expect(items[0].getAttribute("role")).toEqual("group");
    expect(items[0].getAttribute("aria-roledescription")).toEqual("slide");
    expect(items[0].getAttribute("aria-label")).toEqual("First slide");
    expect(items[0].getAttribute("aria-hidden")).toEqual("false");
    expect(items[1].getAttribute("aria-label")).toEqual("2 of 3");
    expect(items[1].getAttribute("aria-hidden")).toEqual("true");
    expect(items[2].getAttribute("aria-label")).toEqual("3 of 3");

    await stop(true);
  });

  test("next, previous and goTo navigate slides", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const vm = getViewModel(appHost);
    const items = appHost.querySelectorAll("au-carousel-item");

    vm.next();
    expect(vm.activeIndex).toBe(1);
    expect(items[0].getAttribute("aria-hidden")).toEqual("true");
    expect(items[1].getAttribute("aria-hidden")).toEqual("false");

    vm.previous();
    expect(vm.activeIndex).toBe(0);

    vm.goTo(2);
    expect(vm.activeIndex).toBe(2);
    expect(items[2].getAttribute("aria-hidden")).toEqual("false");

    await stop(true);
  });

  test("loops by default and clamps when loop is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-carousel id="looping">
          <au-carousel-item>One</au-carousel-item>
          <au-carousel-item>Two</au-carousel-item>
          <au-carousel-item>Three</au-carousel-item>
        </au-carousel>
        <au-carousel id="clamped" loop.bind="false">
          <au-carousel-item>One</au-carousel-item>
          <au-carousel-item>Two</au-carousel-item>
          <au-carousel-item>Three</au-carousel-item>
        </au-carousel>
      `,
      class App {},
      dependencies
    );

    await startPromise;

    const looping = CustomElement.for(
      appHost.querySelector("au-carousel#looping") as Element
    ).viewModel as AuCarouselCustomElement;
    const clamped = CustomElement.for(
      appHost.querySelector("au-carousel#clamped") as Element
    ).viewModel as AuCarouselCustomElement;

    looping.previous();
    expect(looping.activeIndex).toBe(2);
    looping.next();
    expect(looping.activeIndex).toBe(0);

    clamped.previous();
    expect(clamped.activeIndex).toBe(0);
    clamped.goTo(2);
    clamped.next();
    expect(clamped.activeIndex).toBe(2);

    await stop(true);
  });

  test("dispatches slide-change with the new index", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const element = appHost.querySelector("au-carousel") as Element;
    const handler = jest.fn();
    element.addEventListener("slide-change", handler);

    getViewModel(appHost).goTo(2);
    await Promise.resolve();

    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ index: 2 });

    await stop(true);
  });

  test("activeIndex is two-way bound", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      `
        <au-carousel active-index.bind="index">
          <au-carousel-item>One</au-carousel-item>
          <au-carousel-item>Two</au-carousel-item>
          <au-carousel-item>Three</au-carousel-item>
        </au-carousel>
      `,
      class App {
        index = 0;
      },
      dependencies
    );

    await startPromise;

    getViewModel(appHost).next();
    await Promise.resolve();
    expect(component.index).toBe(1);

    component.index = 2;
    await Promise.resolve();
    expect(getViewModel(appHost).activeIndex).toBe(2);

    await stop(true);
  });

  test("renders prev/next controls and navigates on click", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-carousel")?.shadowRoot;
    const nextButton = shadowRoot?.querySelector(".control-next");
    const prevButton = shadowRoot?.querySelector(".control-prev");

    expect(nextButton).not.toBeNull();
    expect(prevButton).not.toBeNull();

    nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();
    expect(getViewModel(appHost).activeIndex).toBe(1);

    prevButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();
    expect(getViewModel(appHost).activeIndex).toBe(0);

    await stop(true);
  });

  test("hides controls and indicators when disabled", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-carousel controls.bind="false" indicators.bind="false">
          <au-carousel-item>One</au-carousel-item>
          <au-carousel-item>Two</au-carousel-item>
        </au-carousel>
      `,
      class App {},
      dependencies
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-carousel")?.shadowRoot;
    expect(shadowRoot?.querySelector(".control")).toBeNull();
    expect(shadowRoot?.querySelector(".indicators")).toBeNull();

    await stop(true);
  });

  test("indicator buttons select the matching slide", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-carousel")?.shadowRoot;
    const indicators = shadowRoot?.querySelectorAll(".indicator");

    expect(indicators?.length).toBe(3);
    expect(indicators?.[0]?.classList.contains("is-active")).toBe(true);

    indicators?.[2]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();

    expect(getViewModel(appHost).activeIndex).toBe(2);
    expect(shadowRoot?.querySelectorAll(".indicator")?.[2]?.classList.contains("is-active")).toBe(true);

    await stop(true);
  });

  test("arrow keys navigate slides", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      template,
      class App {},
      dependencies
    );

    await startPromise;

    const region = appHost
      .querySelector("au-carousel")
      ?.shadowRoot?.querySelector(".carousel");

    region?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await Promise.resolve();
    expect(getViewModel(appHost).activeIndex).toBe(1);

    region?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await Promise.resolve();
    expect(getViewModel(appHost).activeIndex).toBe(0);

    await stop(true);
  });

  test("autoplay advances slides, pauses on hover and cleans up its timer", async () => {
    const setIntervalSpy = jest.spyOn(window, "setInterval");
    const clearIntervalSpy = jest.spyOn(window, "clearInterval");

    try {
      const { appHost, startPromise, stop } = await createFixture(
        `
          <au-carousel autoplay.bind="true" interval.bind="100">
            <au-carousel-item>One</au-carousel-item>
            <au-carousel-item>Two</au-carousel-item>
          </au-carousel>
        `,
        class App {},
        dependencies
      );

      await startPromise;

      const autoplayCall = setIntervalSpy.mock.calls.find(call => call[1] === 100);
      expect(autoplayCall).toBeDefined();

      // Simulate a timer tick.
      (autoplayCall?.[0] as () => void)();
      expect(getViewModel(appHost).activeIndex).toBe(1);

      // Hovering pauses autoplay.
      const clearCallsBeforeHover = clearIntervalSpy.mock.calls.length;
      const region = appHost
        .querySelector("au-carousel")
        ?.shadowRoot?.querySelector(".carousel");
      region?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(clearCallsBeforeHover);

      // Leaving resumes autoplay.
      const setCallsBeforeLeave = setIntervalSpy.mock.calls.length;
      region?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      expect(setIntervalSpy.mock.calls.length).toBeGreaterThan(setCallsBeforeLeave);

      const clearCallsBeforeStop = clearIntervalSpy.mock.calls.length;
      await stop(true);

      // Detaching clears the pending timer.
      expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(clearCallsBeforeStop);
    } finally {
      setIntervalSpy.mockRestore();
      clearIntervalSpy.mockRestore();
    }
  });
});
