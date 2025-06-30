import * as React from "react"
import {
  House,
  Database,
  FileChartLine,
  Zap,
  Grid2X2Plus,
  UsersRound,
  Info,
} from "lucide-react"

import { DashboardNav } from "@/components/paul/dashboard-nav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// TODO: This is sample data.
const data = {

  navMain: [
    {
      title: "Home",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
    {
      title: "Datasets",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
    {
      title: "Processed Data",
      url: "#",
      icon: FileChartLine,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
    {
      title: "Actions",
      url: "#",
      icon: Zap,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
    {
      title: "Apps",
      url: "#",
      icon: Grid2X2Plus,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },

  ],
  navMore: [
    {
      title: "Team",
      url: "#",
      icon: UsersRound,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
    {
      title: "Help",
      url: "#",
      icon: Info,
      items: [
        {
          title: "Test1",
          url: "#",
        },
        {
          title: "Test2",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader  className="mt-16">
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
