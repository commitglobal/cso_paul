import { ExpandableNav } from "@/components/paul/expandable-nav";
import { SingleNav } from "@/components/paul/single-nav";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { apiGetUrls } from "@/constants/api-urls";
import {
  CircleStackIcon as Database,
  DocumentChartBarIcon as FileChartLine,
  HomeIcon as House,
  InformationCircleIcon as Info,
  SparklesIcon as Zap,
  TableCellsIcon as Grid2X2Plus,
  UsersIcon as UsersRound,
} from "@heroicons/react/24/outline";
import * as React from "react";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  // Create data with translated strings
  const data = {
    navHome: [
      {
        title: t("navigation.home"),
        url: "/",
        icon: House,
      },
    ],
    navMain: [
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
    ],
    navMore: [
      {
        title: t("navigation.team"),
        url: apiGetUrls.teamIndex,
        icon: UsersRound,
      },
      {
        title: t("navigation.help"),
        url: "#",
        icon: Info,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SingleNav items={data.navHome} />
        <ExpandableNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SingleNav items={data.navMore} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
