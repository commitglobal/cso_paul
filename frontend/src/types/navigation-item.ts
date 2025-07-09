import { type SvgIcon } from './svg-icon';

export type NavigationItem = {
  href?: string;
  icon: SvgIcon;
  name: string;
  items?: NavigationItem[];
};
