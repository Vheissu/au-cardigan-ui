import { AuBubbleChartCustomElement } from '../src/components/au-bubble-chart';
import type { BubblePoint } from '../src/components/chart-base';

// Viewport sizes seen in analytics: x/y are CSS pixels, r is share of sessions (%).
const screenSizeData: BubblePoint[] = [
    { label: 'Desktop 1920×1080', x: 1920, y: 1080, r: 24 },
    { label: 'Laptop 1366×768', x: 1366, y: 768, r: 18 },
    { label: 'Laptop 1536×864', x: 1536, y: 864, r: 11 },
    { label: 'Tablet 768×1024', x: 768, y: 1024, r: 6 },
    { label: 'Phone 390×844', x: 390, y: 844, r: 16 },
    { label: 'Phone 360×800', x: 360, y: 800, r: 13 },
    { label: 'Desktop 2560×1440', x: 2560, y: 1440, r: 7 },
];

// Product lines: x is year-on-year growth (%), y is gross margin (%), r is revenue (AUD millions).
const portfolioData: BubblePoint[] = [
    { label: 'Core platform', x: 8, y: 62, r: 41 },
    { label: 'Analytics add-on', x: 26, y: 71, r: 12 },
    { label: 'Mobile app', x: 34, y: 55, r: 8 },
    { label: 'Legacy on-prem', x: -6, y: 38, r: 17 },
    { label: 'Professional services', x: 11, y: 24, r: 9 },
];

const meta = {
    title: 'Charts/Bubble Chart',
    component: AuBubbleChartCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `
            <div style="max-width: 720px;">
                <au-bubble-chart
                    data.bind="data"
                    title.bind="title"
                    x-label.bind="xLabel"
                    y-label.bind="yLabel"
                    grid.bind="grid"
                    legend.bind="legend"
                    animate.bind="animate"
                    width.bind="width"
                    height.bind="height"
                    x-ticks.bind="xTicks"
                    y-ticks.bind="yTicks"></au-bubble-chart>
            </div>`,
        props: args,
    }),
    args: {
        data: screenSizeData,
        title: 'Sessions by viewport size (bubble area = share of sessions)',
        xLabel: 'Viewport width (px)',
        yLabel: 'Viewport height (px)',
        grid: true,
        legend: true,
        animate: true,
        width: 640,
        height: 400,
        xTicks: 5,
        yTicks: 5,
    },
    argTypes: {
        title: { control: 'text' },
        xLabel: { control: 'text' },
        yLabel: { control: 'text' },
        grid: { control: 'boolean' },
        legend: { control: 'boolean' },
        animate: { control: 'boolean' },
        width: { control: { type: 'number', min: 240, max: 1200, step: 20 } },
        height: { control: { type: 'number', min: 160, max: 800, step: 20 } },
        xTicks: { control: { type: 'number', min: 2, max: 10, step: 1 } },
        yTicks: { control: { type: 'number', min: 2, max: 10, step: 1 } },
    },
};

export default meta;

export const Playground = {};

export const ProductPortfolio = {
    render: () => ({
        template: `
            <div style="max-width: 720px;">
                <au-bubble-chart
                    data.bind="data"
                    title="Product portfolio: growth vs margin (bubble area = revenue)"
                    x-label="YoY growth (%)"
                    y-label="Gross margin (%)"></au-bubble-chart>
            </div>`,
        props: { data: portfolioData },
    }),
};

export const MinimalGrid = {
    render: () => ({
        template: `
            <div style="max-width: 720px;">
                <au-bubble-chart
                    data.bind="data"
                    title="Sessions by viewport size"
                    grid.bind="false"
                    legend.bind="false"
                    height.bind="320"></au-bubble-chart>
            </div>`,
        props: { data: screenSizeData },
    }),
};
