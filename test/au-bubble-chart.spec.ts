import { createFixture } from "@aurelia/testing";
import { AuBubbleChartCustomElement } from "./../src/components/au-bubble-chart";
import { createMockContext2D, stubCanvasContext, tick } from "./chart-test-utils";

const sampleData = [
  { x: 10, y: 20, r: 5, label: "Alpha" },
  { x: 30, y: 40, r: 10, label: "Beta" },
  { x: 50, y: 10, r: 2, label: "Gamma" },
];

describe("Bubble Chart", () => {
  let restoreContext: () => void;

  afterEach(() => {
    restoreContext?.();
  });

  test("renders canvas with role img and aria-label", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bubble-chart title="Reach vs engagement" data.bind="data"></au-bubble-chart>',
      class App {
        data = sampleData;
      },
      [AuBubbleChartCustomElement]
    );

    await startPromise;

    const canvas = appHost
      .querySelector("au-bubble-chart")
      ?.shadowRoot?.querySelector("canvas");

    expect(canvas?.getAttribute("role")).toEqual("img");
    expect(canvas?.getAttribute("aria-label")).toContain("Reach vs engagement");
    expect(canvas?.getAttribute("aria-label")).toContain("3 points");

    await stop(true);
  });

  test("legend items match labelled points", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bubble-chart data.bind="data"></au-bubble-chart>',
      class App {
        data = sampleData;
      },
      [AuBubbleChartCustomElement]
    );

    await startPromise;

    const items = appHost
      .querySelector("au-bubble-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(3);
    expect(items?.[0].textContent).toContain("Alpha");
    expect(items?.[1].textContent).toContain("Beta");

    await stop(true);
  });

  test("renders sr-only data table with axis headers", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bubble-chart x-label="Reach" y-label="Engagement" data.bind="data"></au-bubble-chart>',
      class App {
        data = sampleData;
      },
      [AuBubbleChartCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-bubble-chart")?.shadowRoot;
    const headers = Array.from(shadowRoot?.querySelectorAll("table thead th") ?? [])
      .map(th => th.textContent);
    const rows = shadowRoot?.querySelectorAll("table tbody tr");

    expect(headers).toEqual(["Label", "Reach", "Engagement", "Size"]);
    expect(rows?.length).toEqual(3);
    expect(rows?.[0].querySelectorAll("td")[0].textContent).toEqual("Alpha");
    expect(rows?.[0].querySelectorAll("td")[1].textContent).toEqual("10");

    await stop(true);
  });

  test("data mutation triggers re-render without throwing when context is null", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-bubble-chart data.bind="data"></au-bubble-chart>',
      class App {
        data = sampleData;
      },
      [AuBubbleChartCustomElement]
    );

    await startPromise;

    component.data = [{ x: 1, y: 2, r: 3, label: "Delta" }];

    await tick();

    const items = appHost
      .querySelector("au-bubble-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(1);
    expect(items?.[0].textContent).toContain("Delta");

    await stop(true);
  });

  test("draws bubbles to a mocked 2d context", async () => {
    const ctx = createMockContext2D();
    restoreContext = stubCanvasContext(ctx);

    const { startPromise, stop } = await createFixture(
      '<au-bubble-chart animate.bind="false" x-label="Reach" data.bind="data"></au-bubble-chart>',
      class App {
        data = sampleData;
      },
      [AuBubbleChartCustomElement]
    );

    await startPromise;
    await tick();

    expect(ctx.clearRect).toHaveBeenCalled();
    // One full circle per point.
    const fullCircles = ctx.arc.mock.calls.filter(call => call[4] === Math.PI * 2);
    expect(fullCircles.length).toEqual(3);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
    const drawnText = ctx.fillText.mock.calls.map(call => call[0]);
    expect(drawnText).toContain("Reach");

    await stop(true);
  });
});
