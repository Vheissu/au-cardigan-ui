import { createFixture } from "@aurelia/testing";
import { AuBarChartCustomElement } from "./../src/components/au-bar-chart";
import { createMockContext2D, stubCanvasContext, tick } from "./chart-test-utils";

const sampleData = [
  { label: "Q1", value: 10 },
  { label: "Q2", value: 25 },
  { label: "Q3", value: 40 },
];

describe("Bar Chart", () => {
  let restoreContext: () => void;

  afterEach(() => {
    restoreContext?.();
  });

  test("renders canvas with role img and aria-label from inherited title bindable", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bar-chart title="Quarterly sales" data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;

    const canvas = appHost
      .querySelector("au-bar-chart")
      ?.shadowRoot?.querySelector("canvas");

    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute("role")).toEqual("img");
    expect(canvas?.getAttribute("aria-label")).toContain("Quarterly sales");
    expect(canvas?.getAttribute("aria-label")).toContain("Q1");

    await stop(true);
  });

  test("inherited width/height bindables size the canvas backing store", async () => {
    restoreContext = stubCanvasContext(createMockContext2D());

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bar-chart width.bind="300" height.bind="150" animate.bind="false" data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;
    await tick();

    const canvas = appHost
      .querySelector("au-bar-chart")
      ?.shadowRoot?.querySelector("canvas");

    expect(canvas?.width).toEqual(300);
    expect(canvas?.height).toEqual(150);

    await stop(true);
  });

  test("legend items match data", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bar-chart data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;

    const items = appHost
      .querySelector("au-bar-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(3);
    expect(items?.[0].textContent).toContain("Q1");
    expect(items?.[2].textContent).toContain("Q3");

    await stop(true);
  });

  test("legend shows series names in series mode", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bar-chart series.bind="series" labels.bind="labels"></au-bar-chart>',
      class App {
        series = [
          { name: "2023", values: [1, 2, 3] },
          { name: "2024", values: [2, 3, 4] },
        ];
        labels = ["Jan", "Feb", "Mar"];
      },
      [AuBarChartCustomElement]
    );

    await startPromise;

    const items = appHost
      .querySelector("au-bar-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(2);
    expect(items?.[0].textContent).toContain("2023");
    expect(items?.[1].textContent).toContain("2024");

    await stop(true);
  });

  test("renders sr-only data table", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-bar-chart data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-bar-chart")?.shadowRoot;
    const headers = shadowRoot?.querySelectorAll("table thead th");
    const rows = shadowRoot?.querySelectorAll("table tbody tr");

    expect(headers?.[0].textContent).toEqual("Label");
    expect(headers?.[1].textContent).toEqual("Value");
    expect(rows?.length).toEqual(3);
    expect(rows?.[1].querySelectorAll("td")[0].textContent).toEqual("Q2");
    expect(rows?.[1].querySelectorAll("td")[1].textContent).toEqual("25");

    await stop(true);
  });

  test("data mutation triggers re-render without throwing when context is null", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-bar-chart data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;

    component.data = [
      { label: "A", value: 5 },
      { label: "B", value: 15 },
    ];

    await tick();

    const items = appHost
      .querySelector("au-bar-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(2);
    expect(items?.[0].textContent).toContain("A");

    await stop(true);
  });

  test("draws to a mocked 2d context", async () => {
    const ctx = createMockContext2D();
    restoreContext = stubCanvasContext(ctx);

    const { startPromise, stop } = await createFixture(
      '<au-bar-chart animate.bind="false" show-values.bind="true" data.bind="data"></au-bar-chart>',
      class App {
        data = sampleData;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;
    await tick();

    expect(ctx.clearRect).toHaveBeenCalled();
    // Bars are drawn via roundRect+fill (feature-detected) or fillRect.
    const barDraws = ctx.roundRect.mock.calls.length + ctx.fillRect.mock.calls.length;
    expect(barDraws).toBeGreaterThan(0);
    // Tick, category and value labels.
    expect(ctx.fillText).toHaveBeenCalled();
    const drawnText = ctx.fillText.mock.calls.map(call => call[0]);
    expect(drawnText).toContain("Q1");

    await stop(true);
  });

  test("re-draws grouped bars when series changes", async () => {
    const ctx = createMockContext2D();
    restoreContext = stubCanvasContext(ctx);

    const { component, startPromise, stop } = await createFixture(
      '<au-bar-chart animate.bind="false" series.bind="series" labels.bind="labels" stacked.bind="stacked"></au-bar-chart>',
      class App {
        series = [
          { name: "2023", values: [1, 2, 3] },
          { name: "2024", values: [2, 3, 4] },
        ];
        labels = ["Jan", "Feb", "Mar"];
        stacked = false;
      },
      [AuBarChartCustomElement]
    );

    await startPromise;
    await tick();

    const drawsBefore = ctx.roundRect.mock.calls.length + ctx.fillRect.mock.calls.length;
    expect(drawsBefore).toBeGreaterThan(0);

    component.stacked = true;
    await tick();

    const drawsAfter = ctx.roundRect.mock.calls.length + ctx.fillRect.mock.calls.length;
    expect(drawsAfter).toBeGreaterThan(drawsBefore);

    await stop(true);
  });
});
