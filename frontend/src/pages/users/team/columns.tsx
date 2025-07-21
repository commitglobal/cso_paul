"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_login: string;
  date_joined: string;
  is_current_user: boolean;
};

export const Columns: () => ColumnDef<User>[] = () => {
  const { t } = useTranslation();
  return [
    {
      accessorKey: "email",
      header: "User",
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
      header: "Role",
    },
    {
      accessorKey: "added_since",
      header: "Added since",
    },
    {
      accessorKey: "last_activity",
      header: "Last activity",
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
            <DropdownMenuItem onClick={() => console.log("viewUserInfo", row.original.id)}>
              {t('users.team.menu.viewUserInfo')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("changeUserRole", row.original.id)}>
              {t('users.team.menu.changeUserRole')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("deleteFromTeam", row.original.id)}>
              {t('users.team.menu.deleteFromTeam')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
