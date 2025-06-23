import { NavigationItem } from '@/types/NavigationItem';
import {
  DashboardIcon,
  UsersIcon,
} from '@/components/dashboard-icons';

export const navigation: NavigationItem[] = [
    {
        name: 'Dashboard',
        href: "/",
        icon: DashboardIcon,
    },
    {
        name: 'Users',
        href: "/users/team/",
        icon: UsersIcon,
    },
];
