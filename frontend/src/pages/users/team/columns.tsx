"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { type ColumnDef } from "@tanstack/react-table";
import type { UserProps } from "@/pages/users/team/team-page-props-struct.ts";

function onViewUserInfo(id: number) {
  // TODO: Implement user info view logic
  console.log("viewUserInfo", id);
}

function onChangeUserRole(id: number) {
  // TODO: Implement role change logic
  console.log("changeUserRole", id);
}

function onDeleteFromTeam(id: number) {
  // TODO: Implement deletion logic
  console.log("deleteFromTeam", id);
}

export const Columns: (t: (key: string) => string) => ColumnDef<UserProps>[] = (t) => {
  return [
    {
      accessorKey: "user",
      header: t("users.team.table.user"),
      cell: ({ row }) => (
        <div className="flex flex-col gap-2">
          <span>
            {row.original.first_name} {row.original.last_name}
            {row.original.is_current_user && (
              <> {t("users.team.current_user_marker")}</>
            )}
          </span>
          <span className="text-gray-500">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("users.team.table.role"),
    },
    {
      accessorKey: "added_since",
      header: t("users.team.table.added_since"),
    },
    {
      accessorKey: "last_activity",
      header: t("users.team.table.last_activity"),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon className="w-[24px] h-[24px] text-gray-500 hover:bg-gray-50 rounded-full" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onViewUserInfo(row.original.id)}>
              {t('users.team.menu.viewUserInfo')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeUserRole(row.original.id)}>
              {t('users.team.menu.changeUserRole')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteFromTeam(row.original.id)}>
              {t('users.team.menu.deleteFromTeam')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
