import { AuRadarChartCustomElement } from '../src/components/au-radar-chart';
import type { ChartSeries } from '../src/components/chart-base';

const skillLabels = ['TypeScript', 'CSS', 'Testing', 'Accessibility', 'Performance', 'Tooling'];

const skillSeries: ChartSeries[] = [
    { name: 'Frontend engineer', values: [8, 9, 6, 8, 7, 7] },
    { name: 'Full-stack engineer', values: [9, 5, 8, 5, 8, 9] },
];

const teamAverage: ChartSeries[] = [
    { name: 'Team average', values: [7.2, 6.8, 6.1, 5.4, 6.6, 7.5] },
];

const meta = {
    title: 'Charts/Radar Chart',
    component: AuRadarChartCustomElement,
    render: (args: Record<string, unknown>) => ({
        template: `
            <div style="max-width: 520px;">
                <au-radar-chart
                    labels.bind="labels"
                    series.bind="series"
                    title.bind="title"
                    max.bind="max"
                    levels.bind="levels"
                    fill.bind="fill"
                    legend.bind="legend"
                    animate.bind="animate"
                    width.bind="width"
                    height.bind="height"></au-radar-chart>
            </div>`,
        props: args,
    }),
    args: {
        labels: skillLabels,
        series: skillSeries,
        title: 'Skill self-assessment (0-10)',
        max: 10,
        levels: 5,
        fill: true,
        legend: true,
        animate: true,
        width: 480,
        height: 400,
    },
    argTypes: {
        title: { control: 'text' },
        max: { control: { type: 'number', min: 1, max: 100, step: 1 } },
        levels: { control: { type: 'number', min: 2, max: 10, step: 1 } },
        fill: { control: 'boolean' },
        legend: { control: 'boolean' },
        animate: { control: 'boolean' },
        width: { control: { type: 'number', min: 240, max: 900, step: 20 } },
        height: { control: { type: 'number', min: 200, max: 800, step: 20 } },
    },
};

export default meta;

export const Playground = {};

export const OutlineOnly = {
    args: {
        fill: false,
        title: 'Skill self-assessment, outline only (0-10)',
    },
};

export const SingleSeries = {
    render: () => ({
        template: `
            <div style="max-width: 520px;">
                <au-radar-chart
                    labels.bind="labels"
                    series.bind="series"
                    title="Team average skill profile (0-10)"
                    max.bind="10"
                    width.bind="480"
                    height.bind="400"></au-radar-chart>
            </div>`,
        props: { labels: skillLabels, series: teamAverage },
    }),
};
