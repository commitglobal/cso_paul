import type { HeaderProps } from "@/types/table-header";

export function mapHeaderToColumns(header: Array<HeaderProps>) {
  return header.map(({ accessorKey, header, enableSorting }) => ({
    accessorKey: accessorKey,
    header: header,
    enableSorting: enableSorting,
  }));
}
