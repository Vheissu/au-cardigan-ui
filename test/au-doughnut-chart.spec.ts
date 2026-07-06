import { createFixture } from "@aurelia/testing";
import { AuDoughnutChartCustomElement } from "./../src/components/au-doughnut-chart";
import { createMockContext2D, stubCanvasContext, tick } from "./chart-test-utils";

const sampleData = [
  { label: "Desktop", value: 60 },
  { label: "Mobile", value: 30 },
  { label: "Tablet", value: 10 },
];

describe("Doughnut Chart", () => {
  let restoreContext: () => void;

  afterEach(() => {
    restoreContext?.();
  });

  test("renders canvas with role img and aria-label including percentages", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-doughnut-chart title="Traffic share" data.bind="data"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;

    const canvas = appHost
      .querySelector("au-doughnut-chart")
      ?.shadowRoot?.querySelector("canvas");

    expect(canvas?.getAttribute("role")).toEqual("img");
    expect(canvas?.getAttribute("aria-label")).toContain("Traffic share");
    expect(canvas?.getAttribute("aria-label")).toContain("Desktop 60 (60%)");

    await stop(true);
  });

  test("legend items match data", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-doughnut-chart data.bind="data"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;

    const items = appHost
      .querySelector("au-doughnut-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(3);
    expect(items?.[0].textContent).toContain("Desktop");
    expect(items?.[2].textContent).toContain("Tablet");

    await stop(true);
  });

  test("renders sr-only data table with percentages", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-doughnut-chart data.bind="data"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-doughnut-chart")?.shadowRoot;
    const headers = Array.from(shadowRoot?.querySelectorAll("table thead th") ?? [])
      .map(th => th.textContent);
    const firstRow = shadowRoot?.querySelectorAll("table tbody tr")[0];
    const cells = Array.from(firstRow?.querySelectorAll("td") ?? []).map(td => td.textContent);

    expect(headers).toEqual(["Label", "Value", "Percentage"]);
    expect(cells).toEqual(["Desktop", "60", "60%"]);

    await stop(true);
  });

  test("renders center label and value as an HTML overlay", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, startPromise, stop } = await createFixture(
      '<au-doughnut-chart data.bind="data" center-label="Total" center-value="100"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;

    const shadowRoot = appHost.querySelector("au-doughnut-chart")?.shadowRoot;

    expect(shadowRoot?.querySelector(".center-value")?.textContent).toEqual("100");
    expect(shadowRoot?.querySelector(".center-label")?.textContent).toEqual("Total");

    await stop(true);
  });

  test("data mutation triggers re-render without throwing when context is null", async () => {
    restoreContext = stubCanvasContext(null);

    const { appHost, component, startPromise, stop } = await createFixture(
      '<au-doughnut-chart data.bind="data"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;

    component.data = [
      { label: "A", value: 1 },
      { label: "B", value: 1 },
    ];

    await tick();

    const items = appHost
      .querySelector("au-doughnut-chart")
      ?.shadowRoot?.querySelectorAll(".legend-item");

    expect(items?.length).toEqual(2);

    await stop(true);
  });

  test("draws segments to a mocked 2d context", async () => {
    const ctx = createMockContext2D();
    restoreContext = stubCanvasContext(ctx);

    const { startPromise, stop } = await createFixture(
      '<au-doughnut-chart animate.bind="false" show-values.bind="true" data.bind="data"></au-doughnut-chart>',
      class App {
        data = sampleData;
      },
      [AuDoughnutChartCustomElement]
    );

    await startPromise;
    await tick();

    expect(ctx.clearRect).toHaveBeenCalled();
    // Two arcs per segment (outer sweep + inner return) for three segments.
    expect(ctx.arc.mock.calls.length).toEqual(6);
    expect(ctx.fill.mock.calls.length).toBeGreaterThanOrEqual(3);
    const drawnText = ctx.fillText.mock.calls.map(call => call[0]);
    expect(drawnText).toContain("60%");

    await stop(true);
  });
});
