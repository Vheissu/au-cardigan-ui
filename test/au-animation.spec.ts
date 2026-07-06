import { createFixture } from "@aurelia/testing";
import { CustomElement } from "@aurelia/runtime-html";
import {
  AuAnimationCustomElement,
  AnimationPresets,
} from "./../src/components/au-animation";

interface FakeAnimation {
  play: jest.Mock;
  pause: jest.Mock;
  cancel: jest.Mock;
  onfinish: (() => void) | null;
}

describe("Animation", () => {
  let animateMock: jest.Mock;
  let animations: FakeAnimation[];

  function lastAnimation(): FakeAnimation {
    return animations[animations.length - 1];
  }

  function getViewModel(appHost: Element): AuAnimationCustomElement {
    const element = appHost.querySelector("au-animation") as Element;
    return CustomElement.for(element).viewModel as AuAnimationCustomElement;
  }

  beforeEach(() => {
    animations = [];
    animateMock = jest.fn(() => {
      const animation: FakeAnimation = {
        play: jest.fn(),
        pause: jest.fn(),
        cancel: jest.fn(),
        onfinish: null,
      };
      animations.push(animation);
      return animation;
    });
    (Element.prototype as any).animate = animateMock;
  });

  afterEach(() => {
    delete (Element.prototype as any).animate;
  });

  test("exports all documented presets", () => {
    const expected = [
      "fade-in",
      "fade-out",
      "slide-in-up",
      "slide-in-down",
      "slide-in-left",
      "slide-in-right",
      "slide-out-up",
      "slide-out-down",
      "zoom-in",
      "zoom-out",
      "bounce",
      "shake",
      "pulse",
      "flip-x",
      "flip-y",
      "rotate-in",
      "wobble",
      "heartbeat",
    ];
    for (const preset of expected) {
      expect(AnimationPresets[preset]).toBeDefined();
      expect(AnimationPresets[preset].length).toBeGreaterThanOrEqual(2);
    }
  });

  test("autoplays preset on attach with default timing", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animation preset="fade-in"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    expect(animateMock).toHaveBeenCalledTimes(1);
    const [frames, options] = animateMock.mock.calls[0];
    expect(frames).toEqual(AnimationPresets["fade-in"]);
    expect(options).toEqual(
      expect.objectContaining({
        duration: 600,
        delay: 0,
        easing: "ease",
        iterations: 1,
        direction: "normal",
        fill: "both",
      })
    );
    expect(getViewModel(appHost).playing).toBe(true);

    await stop(true);
  });

  test("custom keyframes override the preset", async () => {
    const frames = [{ opacity: 0.25 }, { opacity: 0.75 }];
    const { startPromise, stop } = await createFixture(
      '<au-animation preset="fade-in" keyframes.bind="frames"><p>Content</p></au-animation>',
      class App {
        frames = frames;
      },
      [AuAnimationCustomElement]
    );

    await startPromise;

    expect(animateMock).toHaveBeenCalledTimes(1);
    expect(animateMock.mock.calls[0][0]).toEqual(frames);

    await stop(true);
  });

  test("iterations 'infinite' maps to Infinity", async () => {
    const { startPromise, stop } = await createFixture(
      '<au-animation preset="pulse" iterations="infinite"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    expect(animateMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ iterations: Infinity })
    );

    await stop(true);
  });

  test("does not autoplay when autoplay is false", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animation preset="fade-in" autoplay.bind="false"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    expect(animateMock).not.toHaveBeenCalled();
    expect(getViewModel(appHost).playing).toBe(false);

    await stop(true);
  });

  test("dispatches animation-start and animation-finish events", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animation preset="zoom-in" autoplay.bind="false"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    const element = appHost.querySelector("au-animation") as Element;
    const started = jest.fn();
    const finished = jest.fn();
    element.addEventListener("animation-start", started);
    element.addEventListener("animation-finish", finished);

    getViewModel(appHost).play();

    expect(started).toHaveBeenCalledTimes(1);
    expect(finished).not.toHaveBeenCalled();

    lastAnimation().onfinish?.();

    expect(finished).toHaveBeenCalledTimes(1);
    expect(getViewModel(appHost).playing).toBe(false);

    await stop(true);
  });

  test("pause, play, restart and cancel control the animation", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-animation preset="shake"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    const vm = getViewModel(appHost);
    const first = lastAnimation();

    vm.pause();
    expect(first.pause).toHaveBeenCalledTimes(1);
    expect(vm.playing).toBe(false);

    vm.play();
    expect(first.play).toHaveBeenCalledTimes(1);
    expect(vm.playing).toBe(true);

    vm.restart();
    expect(first.cancel).toHaveBeenCalledTimes(1);
    expect(animateMock).toHaveBeenCalledTimes(2);
    expect(vm.playing).toBe(true);

    vm.cancel();
    expect(lastAnimation().cancel).toHaveBeenCalledTimes(1);
    expect(vm.playing).toBe(false);

    await stop(true);
  });

  test("playing two-way binding starts and pauses the animation", async () => {
    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-animation preset="fade-in" autoplay.bind="false" playing.bind="isPlaying"><p>Content</p></au-animation>',
      class App {
        isPlaying = false;
      },
      [AuAnimationCustomElement]
    );

    await startPromise;

    expect(animateMock).not.toHaveBeenCalled();

    component.isPlaying = true;
    await Promise.resolve();

    expect(animateMock).toHaveBeenCalledTimes(1);

    component.isPlaying = false;
    await Promise.resolve();

    expect(lastAnimation().pause).toHaveBeenCalledTimes(1);
    expect(getViewModel(appHost).playing).toBe(false);

    await stop(true);
  });

  test("no-ops safely when element.animate is unavailable", async () => {
    delete (Element.prototype as any).animate;

    const { appHost, startPromise, stop } = await createFixture(
      '<au-animation preset="fade-in"><p>Content</p></au-animation>',
      class App {},
      [AuAnimationCustomElement]
    );

    await startPromise;

    const vm = getViewModel(appHost);
    expect(vm.playing).toBe(false);
    expect(() => {
      vm.play();
      vm.pause();
      vm.restart();
      vm.cancel();
    }).not.toThrow();

    await stop(true);
  });
});
