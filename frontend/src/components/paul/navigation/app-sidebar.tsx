import { NavExpandable } from "@/components/paul/navigation/nav-expandable";
import { NavLogo } from "@/components/paul/navigation/nav-logo";
import { NavUser } from "@/components/paul/navigation/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import type { UserProps } from "@/types/user";
import {
  CircleStackIcon as Database,
  DocumentChartBarIcon as FileChartLine,
  SparklesIcon as Zap,
  TableCellsIcon as Grid2X2Plus,
} from "@heroicons/react/24/outline";
import * as React from "react";
import { useTranslation } from "react-i18next";

type AppSidebarProps = {
  user: UserProps;
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { t } = useTranslation();

  const navMain = [
    {
      title: t("navigation.datasets"),
      url: "#",
      icon: Database,
      items: [
        {
          title: t("navigation.test1"),
          url: "#",
        },
        {
          title: t("navigation.test2"),
          url: "#",
        },
      ],
    },
    {
      title: t("navigation.processedData"),
      url: "#",
      icon: FileChartLine,
      items: [
        {
          title: t("navigation.test1"),
          url: "#",
        },
        {
          title: t("navigation.test2"),
          url: "#",
        },
      ],
    },
    {
      title: t("navigation.actions"),
      url: "#",
      icon: Zap,
      items: [
        {
          title: t("navigation.test1"),
          url: "#",
        },
        {
          title: t("navigation.test2"),
          url: "#",
        },
      ],
    },
    {
      title: t("navigation.apps"),
      url: "#",
      icon: Grid2X2Plus,
      items: [
        {
          title: t("navigation.test1"),
          url: "#",
        },
        {
          title: t("navigation.test2"),
          url: "#",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavExpandable items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
