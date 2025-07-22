import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({...props}: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({className, ...props}: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({className, ...props}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink(
  {
    asChild,
    className,
    ...props
  }: React.ComponentProps<"a"> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({className, ...props}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator(
  {
    children,
    className,
    ...props
  }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight/>}
    </li>
  )
}

function BreadcrumbEllipsis(
  {
    className,
    ...props
  }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4"/>
      <span className="sr-only">More</span>
    </span>
  )
}

type BreadcrumbListItem = {
  label: string
  url?: string
}

function Breadcrumbs({breadcrumbList}: { breadcrumbList: BreadcrumbListItem[] }) {
  if (!breadcrumbList || breadcrumbList.length < 2) return null;

  const maxItems = 5;
  const showEllipsis = breadcrumbList.length > maxItems;
  let itemsToRender: (BreadcrumbListItem | "ellipsis")[] = [];

  if (showEllipsis) {
    // Show: first, ellipsis, last 3
    itemsToRender = [
      breadcrumbList[0],
      "ellipsis",
      ...breadcrumbList.slice(-3),
    ];
  } else {
    itemsToRender = breadcrumbList;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {itemsToRender.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <React.Fragment key="ellipsis">
                <BreadcrumbEllipsis/>
                <BreadcrumbSeparator/>
              </React.Fragment>
            );
          }
          const isLast = idx === itemsToRender.length - 1;
          return (
            <React.Fragment key={idx}>
              <BreadcrumbItem>
                {!isLast && (item as BreadcrumbListItem).url ? (
                  <BreadcrumbLink href={(item as BreadcrumbListItem).url}>
                    {(item as BreadcrumbListItem).label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{(item as BreadcrumbListItem).label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator/>}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


export { type BreadcrumbListItem, Breadcrumbs }
