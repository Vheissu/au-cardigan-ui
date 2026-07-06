import { AuDoughnutChartCustomElement } from '../src/components/au-doughnut-chart';
import type { ChartDatum } from '../src/components/chart-base';

const browserShareData: ChartDatum[] = [
    { label: 'Chrome', value: 64 },
    { label: 'Safari', value: 19 },
    { label: 'Edge', value: 6 },
    { label: 'Firefox', value: 4 },
    { label: 'Samsung Internet', value: 3 },
    { label: 'Other', value: 4 },
];

const storageData: ChartDatum[] = [
    { label: 'Documents', value: 6.2 },
    { label: 'Media', value: 4.8 },
    { label: 'Backups', value: 3.4 },
    { label: 'Free', value: 5.6, color: '#CED4DA' },
];

const meta = {
    title: 'Charts/Doughnut Chart',
    component: AuDoughnutChartCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `
            <div style="max-width: 480px;">
                <au-doughnut-chart
                    data.bind="data"
                    title.bind="title"
                    cutout.bind="cutout"
                    start-angle.bind="startAngle"
                    show-values.bind="showValues"
                    center-label.bind="centerLabel"
                    center-value.bind="centerValue"
                    legend.bind="legend"
                    animate.bind="animate"
                    width.bind="width"
                    height.bind="height"></au-doughnut-chart>
            </div>`,
        props: args,
    }),
    args: {
        data: browserShareData,
        title: 'Browser share of sessions (%)',
        cutout: 0.6,
        startAngle: -90,
        showValues: false,
        centerLabel: '',
        centerValue: '',
        legend: true,
        animate: true,
        width: 420,
        height: 320,
    },
    argTypes: {
        title: { control: 'text' },
        cutout: { control: { type: 'range', min: 0, max: 0.9, step: 0.05 } },
        startAngle: { control: { type: 'number', min: -180, max: 180, step: 15 } },
        showValues: { control: 'boolean' },
        centerLabel: { control: 'text' },
        centerValue: { control: 'text' },
        legend: { control: 'boolean' },
        animate: { control: 'boolean' },
        width: { control: { type: 'number', min: 200, max: 800, step: 20 } },
        height: { control: { type: 'number', min: 160, max: 600, step: 20 } },
    },
};

export default meta;

export const Playground = {};

export const PieChart = {
    args: {
        cutout: 0,
        showValues: true,
        title: 'Browser share of sessions (%)',
    },
};

export const CenterMetric = {
    render: () => ({
        template: `
            <div style="max-width: 480px;">
                <au-doughnut-chart
                    data.bind="data"
                    title="Workspace storage (GB)"
                    cutout.bind="0.7"
                    center-value="14.4 GB"
                    center-label="of 20 GB used"
                    width.bind="420"
                    height.bind="320"></au-doughnut-chart>
            </div>`,
        props: { data: storageData },
    }),
};
