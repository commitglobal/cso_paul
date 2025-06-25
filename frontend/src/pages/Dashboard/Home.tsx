import { useValidatedProps } from '@/hooks/useValidatedProps';
import { DashboardHomeProps } from './DashboardHomeProps';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardHome() {
  const {
    props: { ok },
  } = useValidatedProps<DashboardHomeProps>(DashboardHomeProps);

  return (
    <>
    <div className='fixed top-0 z-40 left-0 right-0'>
      <div className='flex justify-between h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-md sm:gap-x-6 sm:px-6 xl:shadow-none'>
        <div className='flex gap-6 w-full'>
          PAUL
        </div>
    
        <div className='flex gap-x-4 self-stretch xl:gap-x-6'>
          <div className='flex items-center gap-x-4 xl:gap-x-6'>
            {/* Profile dropdown */}

          </div>
        </div>
      </div>
    </div>
    <SidebarProvider className="mt-16">
      <AppSidebar />
      <SidebarInset>
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          test
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}