import './polyfills';
import VariableStyles from './variables.css';

export { CardiganConfiguration } from './configuration';
export { CardiganGlobalStyles, applyGlobalStyles } from './global-styles';
export { applyTheme, buildThemeCss } from './theme';
export type { CardiganThemeOptions, CardiganColorToken } from './theme';
export { CardiganThemes, resolveTheme, isThemeName } from './themes';
export type { CardiganTheme, CardiganThemeName } from './themes';
export { AnimationPresets } from './components/au-animation';
export { AuChartBase } from './components/chart-base';
export type { ChartDatum, ChartSeries, BubblePoint, ChartLegendItem } from './components/chart-base';

export const GlobalStyles = VariableStyles;
