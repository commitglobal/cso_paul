import PaginationElided from "@/components/ui/pagination";
import { PaginationIndicator } from "@/components/ui/pagination-indicator";
import { PaginationSizeSelector } from "@/components/ui/pagination-size-selector";
import { QUERY_PARAM_PAGE, QUERY_PARAM_PAGE_SIZE } from "@/constants/query-params";
import { cn } from "@/lib/utils";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export interface PaginationFooterProps {
  totalItems: number;
  totalPages: number;
  className?: string;
}

export function PaginationFooter({ totalItems, totalPages, className }: PaginationFooterProps) {
  const [currentPage] = useQueryState(QUERY_PARAM_PAGE, parseAsInteger.withDefault(1));
  const [perPage] = useQueryState(QUERY_PARAM_PAGE_SIZE, parseAsString.withDefault("10"));

  return (
    <div
      className={cn(
        "grid grid-cols-2 xl:grid-cols-4 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="col-span-1">
        <PaginationIndicator totalItems={totalItems} perPage={perPage} currentPage={currentPage} />
      </div>

      <div className="col-span-1">
        <PaginationSizeSelector />
      </div>

      <div className="col-span-2">
        <PaginationElided totalPages={totalPages} />
      </div>
    </div>
  );
}
