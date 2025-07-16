import { CommonProps } from '@/types/common-props';
import { type ReactNode } from 'react';
import { type Page } from '@inertiajs/core';
import { AppSidebar } from "@/components/paul/app-sidebar";
import { AppTopbar } from "@/components/paul/app-topbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


export default function BaseLayout(page: Page<CommonProps>) {
  const {
    props: { ok },
  } = page;

  return (
      <SidebarProvider>
        
        {/* Side savigation */}
        <AppSidebar />

        <SidebarInset>

          {/* Top navigation */}
          <AppTopbar />

          {/* Breadcrumbs */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Dashboard {ok}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Home</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          {/* Actual content */}
          <main>
            {page as unknown as ReactNode}
          </main>

        </SidebarInset>
      </SidebarProvider>
  )
}