import { type SvgIcon } from "./svg-icon";

type NavigationBaseItem = {
  title: string;
  url: string;
  isActive?: boolean;
};

export type NavigationItem = NavigationBaseItem & {
  icon: SvgIcon;
};

export type NavigationSubItem = NavigationBaseItem;

export type NavigationItemExpandable = NavigationItem & {
  items?: NavigationSubItem[];
};
