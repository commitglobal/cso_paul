import { SvgIcon } from './SvgIcon';
import { UserType } from './User';

export type NavigationItem = {
  href?: string;
  icon: SvgIcon;
  name: string;
  userTypes: (UserType | '')[];
  items?: NavigationItem[];
};
