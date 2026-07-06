import { createFixture } from "@aurelia/testing";
import { AuRadarChartCustomElement } from "./../src/components/au-radar-chart";
import { createMockContext2D, stubCanvasContext, tick } from "./chart-test-utils";

const sampleLabels = ["Speed", "Power", "Range", "Comfort", "Price"];
const sampleSeries = [
  { name: "Model A", values: [4, 3, 5, 2, 4] },
  { name: "Model B", values: [2, 5, 3, 4, 3] },
];

describe("Radar Chart", () => {
  let restoreContext: () => void;

  afterEach(() => {
    restoreContext?.();
  });

  test("renders canvas with role img and aria-label", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-radar-chart title="Model comparison" labels.bind="labels" series.bind="series"></au-radar-chart>',
      class App {
        labels = sampleLabels;
        series = sampleSeries;
      },
      [AuRadarChartCustomElement]
    );

    await startPromise;

    const canvas = appHost
      .querySelector("au-radar-chart")
      ?.shadowRoot?.querySelector("canvas");

    expect(canvas?.getAttribute("role")).toEqual("img");
    expect(canvas?.getAttribute("aria-label")).toContain("Model comparison");
    expect(canvas?.getAttribute("aria-label")).toContain("5 axes");

    await stop(true);
  });

  test("legend items match series", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-radar-chart labels.bind="labels" series.bind="series"></au-radar-chart>',
      class App {
        labels = sampleLabels;
        series = sampleSeries;
      },
      [AuRadarChartCustomElement]
    );

    await startPromise;

    const items = appHost
      .querySelector("au-radar-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(2);
    expect(items?.[0].textContent).toContain("Model A");
    expect(items?.[1].textContent).toContain("Model B");

    await stop(true);
  });

  test("renders sr-only data table with one row per axis", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-radar-chart labels.bind="labels" series.bind="series"></au-radar-chart>',
      class App {
        labels = sampleLabels;
        series = sampleSeries;
      },
      [AuRadarChartCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-radar-chart")?.shadowRoot;
    const headers = Array.from(shadowRoot?.querySelectorAll("table thead th") ?? [])
      .map(th => th.textContent);
    const rows = shadowRoot?.querySelectorAll("table tbody tr");
    const firstRowCells = Array.from(rows?.[0].querySelectorAll("td") ?? []).map(td => td.textContent);

    expect(headers).toEqual(["Axis", "Model A", "Model B"]);
    expect(rows?.length).toEqual(5);
    expect(firstRowCells).toEqual(["Speed", "4", "2"]);

    await stop(true);
  });

  test("series mutation triggers re-render without throwing when context is null", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-radar-chart labels.bind="labels" series.bind="series"></au-radar-chart>',
      class App {
        labels = sampleLabels;
        series = sampleSeries;
      },
      [AuRadarChartCustomElement]
    );

    await startPromise;

    component.series = [{ name: "Model C", values: [1, 2, 3, 4, 5] }];

    await tick();

    const items = appHost
      .querySelector("au-radar-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(1);
    expect(items?.[0].textContent).toContain("Model C");

    await stop(true);
  });

  test("draws rings, spokes and series polygons to a mocked 2d context", async () => {
    const ctx = createMockContext2D();
    restoreContext = stubCanvasContext(ctx);

    const { startPromise, stop } = await createFixture(
      '<au-radar-chart animate.bind="false" labels.bind="labels" series.bind="series" levels.bind="4"></au-radar-chart>',
      class App {
        labels = sampleLabels;
        series = sampleSeries;
      },
      [AuRadarChartCustomElement]
    );

    await startPromise;
    await tick();

    expect(ctx.clearRect).toHaveBeenCalled();
    // 4 rings + 5 spokes + 2 series polygons = 11 stroked paths.
    expect(ctx.stroke.mock.calls.length).toEqual(11);
    // Filled polygons for both series (fill defaults to true).
    expect(ctx.fill.mock.calls.length).toEqual(2);
    const drawnText = ctx.fillText.mock.calls.map(call => call[0]);
    expect(drawnText).toContain("Speed");
    expect(drawnText).toContain("Price");

    await stop(true);
  });
});
