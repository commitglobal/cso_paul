import React from "react"
import { router } from "@inertiajs/react"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { useTranslation } from "react-i18next";

function Pagination({className, ...props}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent(
  {
    className,
    ...props
  }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({...props}: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink(
  {
    className,
    isActive,
    size = "icon",
    ...props
  }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious(
  {
    className,
    ...props
  }: React.ComponentProps<typeof PaginationLink>) {
  const {t} = useTranslation()
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon/>
      <span className="hidden sm:block">
        {t("pagination.previous")}
      </span>
    </PaginationLink>
  )
}

function PaginationNext(
  {
    className,
    ...props
  }: React.ComponentProps<typeof PaginationLink>) {
  const {t} = useTranslation()

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">
        {t("pagination.next")}
      </span>
      <ChevronRightIcon/>
    </PaginationLink>
  )
}

function PaginationEllipsis(
  {
    className,
    ...props
  }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4"/>
      <span className="sr-only">More pages</span>
    </span>
  )
}

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

const PaginationElided: React.FC<PaginationElidedProps> = (
  {
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
      router.get(url, {}, {preserveScroll: true, preserveState: true})
    }
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          />
        </PaginationItem>
        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis/>
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
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationElided
