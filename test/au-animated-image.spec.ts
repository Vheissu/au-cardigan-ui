import { createFixture } from "@aurelia/testing";
import { CustomElement } from "@aurelia/runtime-html";
import { AuAnimatedImageCustomElement } from "./../src/components/au-animated-image";

describe("AnimatedImage", () => {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // jsdom has no 2d canvas context - return null so the component takes its guard path.
    HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as any;
  });

  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.matchMedia = originalMatchMedia;
  });

  function getViewModel(appHost: Element): AuAnimatedImageCustomElement {
    const element = appHost.querySelector("au-animated-image") as Element;
    return CustomElement.for(element).viewModel as AuAnimatedImageCustomElement;
  }

  test("renders image with src and alt", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animated-image src="test.gif" alt="A test gif"></au-animated-image>',
      class App {},
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-animated-image")?.shadowRoot;
    const img = shadowRoot?.querySelector("img");

    expect(img?.getAttribute("src")).toEqual("test.gif");
    expect(img?.getAttribute("alt")).toEqual("A test gif");
    expect(shadowRoot?.querySelector(".animated-image")?.classList.contains("is-playing")).toBe(true);

    await stop(true);
  });

  test("shows overlay button by default and hides it when controls is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      `
        <au-animated-image id="one" src="a.gif" alt="a"></au-animated-image>
        <au-animated-image id="two" src="b.gif" alt="b" controls.bind="false"></au-animated-image>
      `,
      class App {},
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    const withControls = appHost.querySelector("au-animated-image#one")?.shadowRoot;
    const withoutControls = appHost.querySelector("au-animated-image#two")?.shadowRoot;

    expect(withControls?.querySelector("button")).not.toBeNull();
    expect(withControls?.querySelector("button")?.getAttribute("aria-label")).toEqual("Pause animation");
    expect(withoutControls?.querySelector("button")).toBeNull();

    await stop(true);
  });

  test("toggle button pauses and plays, dispatching pause/play events", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animated-image src="test.gif" alt="A test gif"></au-animated-image>',
      class App {},
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    const element = appHost.querySelector("au-animated-image") as Element;
    const shadowRoot = element.shadowRoot;
    const button = shadowRoot?.querySelector("button");
    const playHandler = jest.fn();
    const pauseHandler = jest.fn();
    element.addEventListener("play", playHandler);
    element.addEventListener("pause", pauseHandler);

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();

    expect(pauseHandler).toHaveBeenCalledTimes(1);
    expect(getViewModel(appHost).playing).toBe(false);
    expect(shadowRoot?.querySelector(".animated-image")?.classList.contains("is-paused")).toBe(true);
    expect(button?.getAttribute("aria-label")).toEqual("Play animation");
    expect(button?.getAttribute("aria-pressed")).toEqual("false");

    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();

    expect(playHandler).toHaveBeenCalledTimes(1);
    expect(getViewModel(appHost).playing).toBe(true);
    expect(shadowRoot?.querySelector(".animated-image")?.classList.contains("is-playing")).toBe(true);
    expect(button?.getAttribute("aria-pressed")).toEqual("true");

    await stop(true);
  });

  test("starts paused when autoplay is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animated-image src="test.gif" alt="A test gif" autoplay.bind="false"></au-animated-image>',
      class App {},
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-animated-image")?.shadowRoot;

    expect(getViewModel(appHost).playing).toBe(false);
    expect(shadowRoot?.querySelector(".animated-image")?.classList.contains("is-paused")).toBe(true);
    expect(shadowRoot?.querySelector("button")?.getAttribute("aria-label")).toEqual("Play animation");

    await stop(true);
  });

  test("playing is two-way bound", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-animated-image src="test.gif" alt="A test gif" playing.bind="isPlaying"></au-animated-image>',
      class App {
        isPlaying = true;
      },
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    component.isPlaying = false;
    await Promise.resolve();

    const shadowRoot = appHost.querySelector("au-animated-image")?.shadowRoot;
    expect(shadowRoot?.querySelector(".animated-image")?.classList.contains("is-paused")).toBe(true);

    const button = shadowRoot?.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();

    expect(component.isPlaying).toBe(true);

    await stop(true);
  });

  test("pauses automatically when prefers-reduced-motion is set", async () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as any;

    const { appHost, startPromise, stop } = await createFixture(
      '<au-animated-image src="test.gif" alt="A test gif"></au-animated-image>',
      class App {},
      [AuAnimatedImageCustomElement]
    );

    await startPromise;

    const vm = getViewModel(appHost);
    expect(vm.playing).toBe(false);

    // Explicit user play still wins over the reduced-motion default.
    const button = appHost.querySelector("au-animated-image")?.shadowRoot?.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();

    expect(vm.playing).toBe(true);

    await stop(true);
  });
});
