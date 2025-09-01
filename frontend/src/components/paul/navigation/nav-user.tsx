"use client";

import { useSidebar } from "@/components/hooks/use-sidebar";
import { NavIconLink } from "@/components/paul/navigation/nav-icon-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { apiGetUrls, apiPostUrls } from "@/constants/api-urls";
import type { UserProps } from "@/types/user";
import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  ChevronUpDownIcon,
  Cog8ToothIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

function UserMenuItem({ user }: { user: UserProps }) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user.avatar} alt={user.fullName} />
        <AvatarFallback className="rounded-lg">
          <UserCircleIcon className="size-6" />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium" title={user.fullName}>{user.fullName}</span>
        <span className="truncate text-xs" title={user.email}>{user.email}</span>
      </div>
    </>
  );
}

export function NavUser({ user }: { user: UserProps }) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserMenuItem user={user} />
              <ChevronUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserMenuItem user={user} />
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <NavIconLink href={apiGetUrls.teamIndex} icon={UsersIcon} label={t("navigation.team")} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavIconLink href="#" method="get" icon={QuestionMarkCircleIcon} label={t("navigation.help")} />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <NavIconLink href="#" method="get" icon={BellIcon} label={t("navigation.viewNotifications")} />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <NavIconLink href="#" method="get" icon={PencilIcon} label={t("navigation.yourProfile")} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavIconLink href="#" method="get" icon={Cog8ToothIcon} label={t("navigation.settings")} />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <NavIconLink
                  href={apiPostUrls.userLogout()}
                  method="post"
                  icon={ArrowRightStartOnRectangleIcon}
                  label={t("navigation.signOut")}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
