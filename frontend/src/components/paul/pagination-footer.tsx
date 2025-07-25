import { Pagination } from "@/types/pagination.ts";
import { PaginationIndicator } from "@/components/ui/pagination-indicator.tsx";
import { PaginationSizeSelector } from "@/components/ui/pagination-size-selector.tsx";
import PaginationElided from "@/components/ui/pagination";

type PaginationFooterProps = {
  pagination: Pagination
}

const setPageSize = (size: string) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page_size", size.toString());
  window.location.search = params.toString();
}

export function PaginationFooter({pagination}: PaginationFooterProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="col-span-1">
        <PaginationIndicator pagination={pagination}/>
      </div>

      <div className="col-span-1">
        <PaginationSizeSelector
          value={String(pagination.per_page)}
          onChange={setPageSize}
        />
      </div>

      <div className="col-span-2">
        <PaginationElided
          pagination={pagination}/>
      </div>
    </div>
  )
}
