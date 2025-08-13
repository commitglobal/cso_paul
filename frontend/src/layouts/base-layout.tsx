import { SanitizeHTML } from "@/components/helpers/sanitized-html";
import { AppSidebar } from "@/components/paul/app-sidebar";
import { AppTopbar } from "@/components/paul/app-topbar";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Breadcrumb } from "@/types/breadcrumb";
import { CommonProps } from "@/types/common-props";
import { type Page } from "@inertiajs/core";
import { type ReactNode } from "react";

function renderDescription(description: string | undefined) {
  if (!description) return null;
  return (
    <div className="text-sm max-w-none mb-4">
      <SanitizeHTML html={description} />
    </div>
  );
}

export default function BaseLayout(page: Page<CommonProps>) {
  return (
    <SidebarProvider>
      {/* Side navigation */}
      <AppSidebar />

      <SidebarInset>
        {/* Top navigation */}
        <AppTopbar />

        {/* Breadcrumbs */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumbs breadcrumbList={page.props.breadcrumbs as Breadcrumb[]} />
          </div>
        </header>

        {/* Actual content */}
        <main>
          <div className="container mx-auto p-10 ">
            <h1 className="text-2xl font-bold mb-4">
              <>{page.props.title}</>
            </h1>

            {renderDescription(page.props.description as string)}

            {page as unknown as ReactNode}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
