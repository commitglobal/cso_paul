import { type ColumnDef } from "@tanstack/react-table";

/**
 * Columns for the activity log table in Team User page.
 */
export const ActivityLogColumns: (t: (key: string) => string) => ColumnDef<any>[] = (t) => {
  return [
    {
      accessorKey: "action",
      header: t("users.user.activity_log.action"),
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: t("users.user.activity_log.date"),
      enableSorting: true,
    },
  ];
};
