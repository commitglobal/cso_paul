import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PermissionsProps } from "@/types/permissions";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { type ColumnDef } from "@tanstack/react-table";

/**
 * Columns for the permissions table in Team User page.
 */
export const PermissionsColumns: (t: (key: string) => string) => ColumnDef<PermissionsProps>[] = (t) => [
  {
    accessorKey: "entity",
    header: t("users.user.permissions.entity"),
    enableSorting: true,
  },
  {
    accessorKey: "entity_type",
    header: t("users.user.permissions.entity_type"),
    enableSorting: true,
  },
  {
    accessorKey: "permission",
    header: t("users.user.permissions.permission"),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={t("users.team.menu.actions")}>
          <EllipsisVerticalIcon className="w-[24px] h-[24px] text-gray-500 hover:bg-gray-50 rounded-full" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href={`#${row.original.id}`}>{t("users.user.permissions.action.view")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#">{t("users.user.permissions.action.transfer")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#">{t("users.user.permissions.action.remove")}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
