import * as React from 'react'
import { Database, FileChartLine, Grid2X2Plus, House, Info, UsersRound, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ExpandableNav } from '@/components/paul/expandable-nav'
import { SingleNav } from '@/components/paul/single-nav'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()

  // Create data with translated strings
  const data = {
    navHome: [
      {
        title: t('navigation.home'),
        url: '#',
        icon: House
      }
    ],
    navMain: [
      {
        title: t('navigation.datasets'),
        url: '#',
        icon: Database,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      },
      {
        title: t('navigation.processedData'),
        url: '#',
        icon: FileChartLine,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      },
      {
        title: t('navigation.actions'),
        url: '#',
        icon: Zap,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      },
      {
        title: t('navigation.apps'),
        url: '#',
        icon: Grid2X2Plus,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      }
    ],
    navMore: [
      {
        title: t('navigation.team'),
        url: '#',
        icon: UsersRound,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      },
      {
        title: t('navigation.help'),
        url: '#',
        icon: Info,
        items: [
          {
            title: t('navigation.test1'),
            url: '#'
          },
          {
            title: t('navigation.test2'),
            url: '#'
          }
        ]
      }
    ]
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <SingleNav items={data.navHome} />
        <ExpandableNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ExpandableNav items={data.navMore} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
