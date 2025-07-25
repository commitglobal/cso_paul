import { PaginationIndicator } from "@/components/ui/pagination-indicator.tsx";
import { PaginationSizeSelector } from "@/components/ui/pagination-size-selector.tsx";
import PaginationElided from "@/components/ui/pagination";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export interface PaginationFooterProps {
  totalItems: number;
  totalPages: number;
}

export function PaginationFooter({totalItems, totalPages}: PaginationFooterProps) {
  const [currentPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState("page_size", parseAsString.withDefault("10"));

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="col-span-1">
        <PaginationIndicator totalItems={totalItems} perPage={perPage} currentPage={currentPage}/>
      </div>

      <div className="col-span-1">
        <PaginationSizeSelector />
      </div>

      <div className="col-span-2">
        <PaginationElided totalPages={totalPages}/>
      </div>
    </div>
  )
}
