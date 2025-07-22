import { CommonProps } from '@/types/common-props';
import { type ReactNode } from 'react';
import { type Page } from '@inertiajs/core';
import { AppSidebar } from "@/components/paul/app-sidebar";
import { AppTopbar } from "@/components/paul/app-topbar";
import {
  Breadcrumbs,
  type BreadcrumbListItem,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { SanitizeHTML } from '@/components/helpers/sanitized-html';


function renderDescription(description: string | undefined) {
  if (!description) return null;
  return (
    <div className="text-sm max-w-none mb-4">
      <SanitizeHTML html={description}/>
    </div>
  );
}

export default function BaseLayout(page: Page<CommonProps>) {
  return (
    <SidebarProvider>

      {/* Side savigation */}
      <AppSidebar/>

      <SidebarInset>

        {/* Top navigation */}
        <AppTopbar/>

        {/* Breadcrumbs */}
        <header
          className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs breadcrumbList={page.props.breadcrumbs as BreadcrumbListItem[]} />
          </div>
        </header>

        {/* Actual content */}
        <main>
          <div className="container mx-auto p-10 ">

            <h1 className="text-2xl font-bold mb-4">
              <>
                {page.props.title}
              </>
            </h1>

            {renderDescription(page.props.description as string)}

            <div className="bg-white rounded-lg shadow-sm">
              {page as unknown as ReactNode}
            </div>
          </div>
        </main>

      </SidebarInset>
    </SidebarProvider>
  )

}
