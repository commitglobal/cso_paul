import React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination"
import { router } from "@inertiajs/react"

type PaginationElidedProps = {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  className?: string
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const delta = 2
  const range: (number | "ellipsis")[] = []
  let l = Math.max(2, current - delta)
  let r = Math.min(total - 1, current + delta)

  if (current - delta <= 2) l = 2
  if (current + delta >= total - 1) r = total - 1

  range.push(1)
  if (l > 2) range.push("ellipsis")
  for (let i = l; i <= r; i++) range.push(i)
  if (r < total - 1) range.push("ellipsis")
  if (total > 1) range.push(total)
  return range
}

const PaginationElided: React.FC<PaginationElidedProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  // Default navigation logic using Inertia router and current path
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      const url = `${window.location.pathname}?page=${page}`
      router.get(url, {}, { preserveScroll: true, preserveState: true })
    }
  }

  console.log("PaginationElided rendered with:", {
    currentPage,
    totalPages,
    pageNumbers,
  })

  return (
    <Pagination className={className}>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
            />
          </PaginationItem>
        )}
        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handlePageChange(Number(page))}
                aria-disabled={page === currentPage}
                tabIndex={page === currentPage ? -1 : 0}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationElided
