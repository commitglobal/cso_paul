"use client";

import { FilterButton } from "@/components/data-table/filters/filter-button";
import { PaginationFooter } from "@/components/data-table/pagination-footer";
import { SortButton } from "@/components/data-table/sort-button";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Filters } from "@/types/filter";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  totalPages: number;
  filters?: Filters;
  emptyState: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  totalPages,
  filters,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    <SortButton enableSorting={header.column.columnDef.enableSorting ?? false} headerId={header.id} />

                    {filters && (
                      <FilterButton
                        enableFilter={header.id in filters}
                        headerId={header.id}
                        filterGroup={filters[header.id]}
                      />
                    )}
                  </div>
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
                {emptyState || t("table.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PaginationFooter totalItems={totalItems} totalPages={totalPages} />
    </div>
  );
}
