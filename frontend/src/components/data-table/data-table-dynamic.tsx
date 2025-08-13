"use client";

import { PaginationFooter } from "@/components/data-table/pagination-footer";
import { SortButton } from "@/components/data-table/sort-button";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HeaderItem {
  label: string;
  value: string;
  enableSorting?: boolean;
}

interface DataTableProps {
  header: HeaderItem[];
  totalItems: number;
  totalPages: number;
}

export function DataTableDynamic({
  header,
  totalItems,
  totalPages,
}: DataTableProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {header.map((h) => (
              <TableHead key={h.value}>
                <div className="flex items-center gap-1">
                  {h.label}
                  {h.enableSorting && <SortButton enableSorting={true} headerId={h.value} />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody></TableBody>
      </Table>

      <PaginationFooter totalItems={totalItems} totalPages={totalPages} />
    </div>
  );
}
