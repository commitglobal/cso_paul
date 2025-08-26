"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiGetUrls } from "@/constants/api-urls";
import { TeamChangeUserRoleDialog } from "@/pages/users/team/dialogs/team-change-user-role-dialog";
import { TeamRemoveUserDialog } from "@/pages/users/team/dialogs/team-remove-user-dialog";
import type { UserProps } from "@/pages/users/team/team-page-props-struct";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export const Columns: (t: (key: string) => string) => ColumnDef<UserProps>[] = (t) => {
  return [
    {
      accessorKey: "user",
      header: t("users.team.table.user"),
      cell: ({ row }) => (
        <Link href={`${apiGetUrls.teamIndex}${row.original.id}/`} className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <span>
              {row.original.first_name} {row.original.last_name}
              {row.original.is_current_user && (
                <span className="font-medium"> {t("users.team.current_user_marker")}</span>
              )}
            </span>
            <span className="text-gray-500">{row.original.email}</span>
          </div>
        </Link>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "roleLabel",
      header: t("users.team.table.role"),
      enableSorting: true,
    },
    {
      accessorKey: "added_since",
      header: t("users.team.table.added_since"),
      enableSorting: true,
    },
    {
      accessorKey: "last_activity",
      header: t("users.team.table.last_activity"),
      enableSorting: true,
    },
    {
      id: "actions",
      cell: function ActionsCell({ row }) {
        const [openChangeRoleDialog, setOpenChangeRoleDialog] = useState(false);
        const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label={t("users.team.menu.actions")}>
                <EllipsisVerticalIcon className="w-[24px] h-[24px] text-gray-500 hover:bg-gray-50 rounded-full" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button variant="menu" size="wrapped">
                    <Link href={`${apiGetUrls.teamIndex}${row.original.id}/`}>{t("users.team.menu.viewUserInfo")}</Link>
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setOpenChangeRoleDialog(true)}>
                  <Button variant="menu" size="wrapped">
                    {t("users.team.menu.changeUserRole")}
                  </Button>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setOpenRemoveDialog(true)}>
                  {t("users.team.menu.removeFromTeam")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <TeamChangeUserRoleDialog
              userId={row.original.id}
              userName={`${row.original.first_name} ${row.original.last_name}`}
              userRole={row.original.roleValue}
              open={openChangeRoleDialog}
              setOpen={setOpenChangeRoleDialog}
            />

            <TeamRemoveUserDialog
              userId={row.original.id}
              userName={`${row.original.first_name} ${row.original.last_name}`}
              isNgoHubUser={row.original.ngohub_id !== null}
              open={openRemoveDialog}
              setOpen={setOpenRemoveDialog}
            />
          </>
        );
      },
    },
  ];
};
