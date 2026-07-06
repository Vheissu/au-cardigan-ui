import '../polyfills';
import { IRegistry } from "@aurelia/kernel";

import { AuSelectCustomElement } from "./au-select";
import { AuModalCustomElement } from "./au-modal";
import { AuImageCustomElement } from "./au-image";
import { AuButtonCustomElement } from "./au-button";
import { AuHeadingCustomElement } from "./au-heading";
import { AuCodeCustomElement } from "./au-code";
import { AuBadgeCustomElement } from "./au-badge";
import { AuAlertCustomElement } from "./au-alert";
import { AuProgressCustomElement } from "./au-progress";
import { AuAvatarCustomElement } from "./au-avatar";
import { AuTooltipCustomElement } from "./au-tooltip";
import { AuMenuCustomElement } from "./au-menu";
import { AuMenuItemCustomElement } from "./au-menu-item";
import { AuMenuLabelCustomElement } from "./au-menu-label";
import { AuDividerCustomElement } from "./au-divider";
import { AuInputCustomElement } from "./au-input";
import { AuTextareaCustomElement } from "./au-textarea";
import { AuCheckboxCustomElement } from "./au-checkbox";
import { AuSwitchCustomElement } from "./au-switch";
import { AuCardCustomElement } from "./au-card";
import { AuSpinnerCustomElement } from "./au-spinner";
import { AuSkeletonCustomElement } from "./au-skeleton";
import { AuTabsCustomElement } from "./au-tabs";
import { AuTabPanelCustomElement } from "./au-tab-panel";
import { AuAccordionCustomElement } from "./au-accordion";
import { AuAccordionItemCustomElement } from "./au-accordion-item";
import { AuToastCustomElement } from "./au-toast";
import { AuToastCenterCustomElement } from "./au-toast-center";
import { AuBreadcrumbCustomElement } from "./au-breadcrumb";
import { AuBreadcrumbItemCustomElement } from "./au-breadcrumb-item";
import { AuButtonGroupCustomElement } from "./au-button-group";
import { AuCalloutCustomElement } from "./au-callout";
import { AuAnimatedImageCustomElement } from "./au-animated-image";
import { AuAnimationCustomElement } from "./au-animation";
import { AuCarouselCustomElement } from "./au-carousel";
import { AuCarouselItemCustomElement } from "./au-carousel-item";
import { AuBarChartCustomElement } from "./au-bar-chart";
import { AuBubbleChartCustomElement } from "./au-bubble-chart";
import { AuDoughnutChartCustomElement } from "./au-doughnut-chart";
import { AuRadarChartCustomElement } from "./au-radar-chart";
import { AuCheckboxGroupCustomElement } from "./au-checkbox-group";
import { AuColorPickerCustomElement } from "./au-color-picker";
import { AuComboboxCustomElement } from "./au-combobox";
import { AuCopyButtonCustomElement } from "./au-copy-button";
import { AuDateInputCustomElement } from "./au-date-input";

export interface ComponentEntry {
  name: string;
  registry: IRegistry;
}

const entries: ComponentEntry[] = [
  { name: 'au-button', registry: AuButtonCustomElement as unknown as IRegistry },
  { name: 'au-image', registry: AuImageCustomElement as unknown as IRegistry },
  { name: 'au-modal', registry: AuModalCustomElement as unknown as IRegistry },
  { name: 'au-select', registry: AuSelectCustomElement as unknown as IRegistry },
  { name: 'au-input', registry: AuInputCustomElement as unknown as IRegistry },
  { name: 'au-textarea', registry: AuTextareaCustomElement as unknown as IRegistry },
  { name: 'au-checkbox', registry: AuCheckboxCustomElement as unknown as IRegistry },
  { name: 'au-switch', registry: AuSwitchCustomElement as unknown as IRegistry },
  { name: 'au-heading', registry: AuHeadingCustomElement as unknown as IRegistry },
  { name: 'au-code', registry: AuCodeCustomElement as unknown as IRegistry },
  { name: 'au-badge', registry: AuBadgeCustomElement as unknown as IRegistry },
  { name: 'au-alert', registry: AuAlertCustomElement as unknown as IRegistry },
  { name: 'au-progress', registry: AuProgressCustomElement as unknown as IRegistry },
  { name: 'au-avatar', registry: AuAvatarCustomElement as unknown as IRegistry },
  { name: 'au-tooltip', registry: AuTooltipCustomElement as unknown as IRegistry },
  { name: 'au-menu', registry: AuMenuCustomElement as unknown as IRegistry },
  { name: 'au-menu-item', registry: AuMenuItemCustomElement as unknown as IRegistry },
  { name: 'au-menu-label', registry: AuMenuLabelCustomElement as unknown as IRegistry },
  { name: 'au-divider', registry: AuDividerCustomElement as unknown as IRegistry },
  { name: 'au-tabs', registry: AuTabsCustomElement as unknown as IRegistry },
  { name: 'au-tab-panel', registry: AuTabPanelCustomElement as unknown as IRegistry },
  { name: 'au-accordion', registry: AuAccordionCustomElement as unknown as IRegistry },
  { name: 'au-accordion-item', registry: AuAccordionItemCustomElement as unknown as IRegistry },
  { name: 'au-toast', registry: AuToastCustomElement as unknown as IRegistry },
  { name: 'au-toast-center', registry: AuToastCenterCustomElement as unknown as IRegistry },
  { name: 'au-card', registry: AuCardCustomElement as unknown as IRegistry },
  { name: 'au-spinner', registry: AuSpinnerCustomElement as unknown as IRegistry },
  { name: 'au-skeleton', registry: AuSkeletonCustomElement as unknown as IRegistry },
  { name: 'au-breadcrumb', registry: AuBreadcrumbCustomElement as unknown as IRegistry },
  { name: 'au-breadcrumb-item', registry: AuBreadcrumbItemCustomElement as unknown as IRegistry },
  { name: 'au-button-group', registry: AuButtonGroupCustomElement as unknown as IRegistry },
  { name: 'au-callout', registry: AuCalloutCustomElement as unknown as IRegistry },
  { name: 'au-animated-image', registry: AuAnimatedImageCustomElement as unknown as IRegistry },
  { name: 'au-animation', registry: AuAnimationCustomElement as unknown as IRegistry },
  { name: 'au-carousel', registry: AuCarouselCustomElement as unknown as IRegistry },
  { name: 'au-carousel-item', registry: AuCarouselItemCustomElement as unknown as IRegistry },
  { name: 'au-bar-chart', registry: AuBarChartCustomElement as unknown as IRegistry },
  { name: 'au-bubble-chart', registry: AuBubbleChartCustomElement as unknown as IRegistry },
  { name: 'au-doughnut-chart', registry: AuDoughnutChartCustomElement as unknown as IRegistry },
  { name: 'au-radar-chart', registry: AuRadarChartCustomElement as unknown as IRegistry },
  { name: 'au-checkbox-group', registry: AuCheckboxGroupCustomElement as unknown as IRegistry },
  { name: 'au-color-picker', registry: AuColorPickerCustomElement as unknown as IRegistry },
  { name: 'au-combobox', registry: AuComboboxCustomElement as unknown as IRegistry },
  { name: 'au-copy-button', registry: AuCopyButtonCustomElement as unknown as IRegistry },
  { name: 'au-date-input', registry: AuDateInputCustomElement as unknown as IRegistry },
];

export const ComponentEntries: readonly ComponentEntry[] = entries;
export const ComponentRegistry = new Map(entries.map(entry => [entry.name.toLowerCase(), entry.registry]));
export const DefaultComponents: IRegistry[] = entries.map(entry => entry.registry);
