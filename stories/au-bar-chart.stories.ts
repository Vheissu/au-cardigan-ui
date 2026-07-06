import { AuBarChartCustomElement } from '../src/components/au-bar-chart';
import type { ChartDatum, ChartSeries } from '../src/components/chart-base';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const revenueSeries: ChartSeries[] = [
    { name: 'Subscriptions', values: [42, 48, 53, 61, 66, 74] },
    { name: 'Services', values: [18, 16, 21, 19, 24, 27] },
    { name: 'Licences', values: [9, 11, 8, 12, 14, 13] },
];

const headcountData: ChartDatum[] = [
    { label: 'Engineering', value: 46 },
    { label: 'Sales', value: 21 },
    { label: 'Support', value: 15 },
    { label: 'Design', value: 12 },
    { label: 'Product', value: 9 },
];

const meta = {
    title: 'Charts/Bar Chart',
    component: AuBarChartCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `
            <div style="max-width: 720px;">
                <au-bar-chart
                    series.bind="series"
                    labels.bind="labels"
                    title.bind="title"
                    horizontal.bind="horizontal"
                    stacked.bind="stacked"
                    show-values.bind="showValues"
                    grid.bind="grid"
                    legend.bind="legend"
                    animate.bind="animate"
                    width.bind="width"
                    height.bind="height"
                    y-ticks.bind="yTicks"></au-bar-chart>
            </div>`,
        props: args,
    }),
    args: {
        series: revenueSeries,
        labels: monthLabels,
        title: 'Monthly revenue by stream (AUD, thousands)',
        horizontal: false,
        stacked: false,
        showValues: false,
        grid: true,
        legend: true,
        animate: true,
        width: 640,
        height: 360,
        yTicks: 5,
    },
    argTypes: {
        title: { control: 'text' },
        horizontal: { control: 'boolean' },
        stacked: { control: 'boolean' },
        showValues: { control: 'boolean' },
        grid: { control: 'boolean' },
        legend: { control: 'boolean' },
        animate: { control: 'boolean' },
        width: { control: { type: 'number', min: 240, max: 1200, step: 20 } },
        height: { control: { type: 'number', min: 160, max: 800, step: 20 } },
        yTicks: { control: { type: 'number', min: 2, max: 10, step: 1 } },
    },
};

export default meta;

export const Playground = {};

export const Stacked = {
    args: {
        stacked: true,
        title: 'Monthly revenue, stacked by stream (AUD, thousands)',
    },
};

export const Horizontal = {
    args: {
        horizontal: true,
        showValues: true,
        title: 'Monthly revenue by stream (AUD, thousands)',
    },
};

export const SingleSeries = {
    render: () => ({
        template: `
            <div style="max-width: 720px;">
                <au-bar-chart
                    data.bind="data"
                    title="Headcount by department"
                    show-values.bind="true"
                    height.bind="300"></au-bar-chart>
            </div>`,
        props: { data: headcountData },
    }),
};
