"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { type ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_login: string; // ISO date string
  date_joined: string; // ISO date string
};

export const columns: (dependinta: any) => ColumnDef<User>[] = (dependinta) => [
  {
    accessorKey: "email",
    header: "User",
    cell: ({ row }) => (
      <div>
        <span>
          {row.original.first_name} {row.original.last_name} {"(you)"}
        </span>
        <span>{row.original.email}</span>
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
    accessorKey: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVerticalIcon className="w-[24px] h-[24px] text-purple-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => console.log("view")}>View {row.original.id}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("edit")}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("resend")}>
            Resend invitation email {dependinta}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
