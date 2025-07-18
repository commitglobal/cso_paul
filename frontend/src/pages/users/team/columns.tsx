"use client"

import { type ColumnDef } from "@tanstack/react-table"

export type UserProps = {
  id: string
  email: string
  first_name: string
  last_name: string
  last_login: string // ISO date string
  date_joined: string // ISO date string
}

export type User = {
  id: string
  user: {
    name: string
    email: string
    is_current_user: boolean
  }
  role: "Admin" | "Manager" | "User"
  added_since: string // ISO date string
  last_activity: string // ISO date string
}


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user",
    header: "User",
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
]
