import { type SvgIcon } from './SvgIcon';

export type NavigationItem = {
  href?: string;
  icon: SvgIcon;
  name: string;
  items?: NavigationItem[];
};
