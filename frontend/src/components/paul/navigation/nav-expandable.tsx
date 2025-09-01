"use client";

import { useSidebar } from "@/components/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavigationItemExpandable } from "@/types/navigation-item";
import { ChevronRightIcon as ChevronRight } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import * as React from "react";

type NavigationExpandableProps = {
  items: NavigationItemExpandable[];
};

function MainButton({ item }: { item: NavigationItemExpandable }) {
  return (
    <SidebarMenuButton asChild tooltip={item.title} isActive={Boolean(item.isActive)}>
      <Link href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
function CollapsedPopover({ item }: { item: NavigationItemExpandable }) {
  const { isMobile } = useSidebar();
  const [openPopover, setOpenPopover] = React.useState(false);

  const handleEnterPopover = React.useCallback(() => {
    if (!isMobile) {
      setOpenPopover(true);
    }
  }, [isMobile]);
  const handleLeavePopover = React.useCallback(() => {
    if (!isMobile) {
      setOpenPopover(false);
    }
  }, [isMobile]);

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <div onMouseEnter={handleEnterPopover} onMouseLeave={handleLeavePopover}>
          <MainButton item={item} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="p-0"
        onMouseEnter={handleEnterPopover}
        onMouseLeave={handleLeavePopover}
      >
        <SidebarMenuSub className="m-0 border-0 px-1 py-1">
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton asChild>
                <Link href={subItem.url}>
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </PopoverContent>
    </Popover>
  );
}

function ExpandedDropdown({ item }: { item: NavigationItemExpandable }) {
  return (
    <>
      <MainButton item={item} />
      <CollapsibleTrigger asChild>
        <Button type="button" variant="new" aria-label="Toggle section" size="wrapped">
          <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {item.items?.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton asChild>
                <Link href={subItem.url}>
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </>
  );
}

function NavExpandableItem({ item }: { item: NavigationItemExpandable }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const hasSubItems = (item.items?.length ?? 0) > 0;

  if (!hasSubItems) {
    return (
      <SidebarMenuItem key={item.title}>
        <MainButton item={item} />
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible key={item.title} asChild defaultOpen={Boolean(item.isActive)} className="group/collapsible">
      <SidebarMenuItem>
        {collapsed ? <CollapsedPopover item={item} /> : <ExpandedDropdown item={item} />}
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavExpandable({ items }: NavigationExpandableProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavExpandableItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
