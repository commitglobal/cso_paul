"use client";

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { createParser, useQueryState } from "nuqs";
import { QUERY_PARAM_SORT } from "@/constants/query-params";
import { Button } from "@/components/ui/button";

const sortParser = createParser<{ key: string; direction: "asc" | "desc" }>({
  parse(value) {
    if (!value) return null;
    const [key, dir] = value.split(",");
    if (!key) return null;

    const direction = (dir === "desc" ? "desc" : "asc") as "asc" | "desc";
    return { key, direction };
  },

  serialize({ key, direction }) {
    return `${key},${direction}`;
  },
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  const [sort, setSort] = useQueryState(QUERY_PARAM_SORT, sortParser.withOptions({ clearOnDefault: true }));

  const setSorting = (columnId: string) => {
    if (!sort || sort.key !== columnId) {
      setSort({ key: columnId, direction: "asc" });
    } else if (sort.direction === "asc") {
      setSort({ key: columnId, direction: "desc" });
    } else {
      setSort(null);
    }
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : !header.column.columnDef.enableSorting ? (
                  flexRender(header.column.columnDef.header, header.getContext())
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSorting(header.column.id);
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sort?.key === header.column.id ? (
                      sort.direction === "asc" ? (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ) : (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
                    )}
                  </Button>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {t("table.noData")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
