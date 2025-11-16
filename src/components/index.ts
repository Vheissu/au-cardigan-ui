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
];

export const ComponentEntries: readonly ComponentEntry[] = entries;
export const ComponentRegistry = new Map(entries.map(entry => [entry.name.toLowerCase(), entry.registry]));
export const DefaultComponents: IRegistry[] = entries.map(entry => entry.registry);
