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

export const DefaultComponents: IRegistry[] = [
  AuButtonCustomElement as unknown as IRegistry,
  AuImageCustomElement as unknown as IRegistry,
  AuModalCustomElement as unknown as IRegistry,
  AuSelectCustomElement as unknown as IRegistry,
  AuInputCustomElement as unknown as IRegistry,
  AuTextareaCustomElement as unknown as IRegistry,
  AuCheckboxCustomElement as unknown as IRegistry,
  AuSwitchCustomElement as unknown as IRegistry,
  AuHeadingCustomElement as unknown as IRegistry,
  AuCodeCustomElement as unknown as IRegistry,
  AuBadgeCustomElement as unknown as IRegistry,
  AuAlertCustomElement as unknown as IRegistry,
  AuProgressCustomElement as unknown as IRegistry,
  AuAvatarCustomElement as unknown as IRegistry,
  AuTooltipCustomElement as unknown as IRegistry,
  AuMenuCustomElement as unknown as IRegistry,
  AuMenuItemCustomElement as unknown as IRegistry,
  AuMenuLabelCustomElement as unknown as IRegistry,
  AuDividerCustomElement as unknown as IRegistry,
  AuTabsCustomElement as unknown as IRegistry,
  AuTabPanelCustomElement as unknown as IRegistry,
  AuAccordionCustomElement as unknown as IRegistry,
  AuAccordionItemCustomElement as unknown as IRegistry,
  AuToastCustomElement as unknown as IRegistry,
  AuToastCenterCustomElement as unknown as IRegistry,
  AuCardCustomElement as unknown as IRegistry,
  AuSpinnerCustomElement as unknown as IRegistry,
  AuSkeletonCustomElement as unknown as IRegistry,
];
