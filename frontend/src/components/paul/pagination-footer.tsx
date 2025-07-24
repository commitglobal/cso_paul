import { Pagination } from "@/types/pagination.ts";
import { PaginationIndicator } from "@/components/ui/pagination-indicator.tsx";
import { PaginationSizeSelector } from "@/components/ui/pagination-size-selector.tsx";
import PaginationElided from "@/components/ui/pagination";

type PaginationFooterProps = {
  pageSize: string
  setPageSize: (size: string) => void
  pagination: Pagination
}

export function PaginationFooter({pageSize, setPageSize, pagination}: PaginationFooterProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <div className="col-span-1">
        <PaginationIndicator pagination={pagination}/>
      </div>
      <div className="col-span-1">

        <PaginationSizeSelector
          value={pageSize}
          onChange={setPageSize}/>
      </div>

      <div className="col-span-2">
        <PaginationElided
          currentPage={pagination.current_page}
          totalPages={pagination.num_pages}/>
      </div>
    </div>
  )
}
