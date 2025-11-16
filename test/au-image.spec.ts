import { createFixture } from "@aurelia/testing";
import { AuImageCustomElement } from "./../src/components/au-image";

describe("Image", () => {
  test("should render image", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      "<au-image></au-image>",
      class App {},
      [AuImageCustomElement]
    );

    await startPromise;

    const image = appHost
      .querySelector("au-image")
      ?.shadowRoot?.querySelector("img");

    expect(image).toBeDefined();

    await stop(true);
  });

  test("should render image with only a src", async () => {
    const { appHost, startPromise, stop } = await createFixture(
      '<au-image src="https://picsum.photos/200/300"></au-image>',
      class App {},
      [AuImageCustomElement]
    );

    await startPromise;

    const image = appHost
      .querySelector("au-image")
      ?.shadowRoot?.querySelector("img") as HTMLImageElement;

    expect(image.src).toEqual("https://picsum.photos/200/300");

    await stop(true);
  });

  test("should render image with only a src and call loaded callback", async () => {
    const viewModel = class ViewModel {
      loaded() {
        return "imgloaded";
      }
    };
    const { appHost, startPromise, stop, component } = await createFixture(
      '<au-image src="https://picsum.photos/200/300" on-load.bind="() => loaded()"></au-image>',
      viewModel,
      [AuImageCustomElement]
    );

    await startPromise;

    jest.spyOn(component, "loaded");

    const image = appHost
      .querySelector("au-image")
      ?.shadowRoot?.querySelector("img") as HTMLImageElement;

    image.dispatchEvent(new Event("load"));

    expect(component.loaded).toBeCalled();

    await stop(true);
  });

  test("should render image using non-image tag", async () => {
    const viewModel = class ViewModel {
      loaded() {
        return "imgloaded";
      }
    };
    const { appHost, startPromise, stop, component } = await createFixture(
      '<au-image src="https://picsum.photos/200/300" fit="cover" on-load.bind="() => loaded()"></au-image>',
      viewModel,
      [AuImageCustomElement]
    );

    await startPromise;

    jest.spyOn(component, "loaded");

    const image = appHost
      .querySelector("au-image")
      ?.shadowRoot?.querySelector("img");

    expect(image).toBeNull();

    const divImage = appHost
      .querySelector("au-image")
      ?.shadowRoot?.querySelector(".scaled-img");

    expect(divImage).not.toBeNull();

    await stop(true);
  });
});
