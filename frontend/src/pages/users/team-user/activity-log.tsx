import { DataTable } from "@/components/data-table/data-table";
import { mapHeaderToColumns } from "@/components/data-table/map-hader-to-columns";
import { Separator } from "@/components/ui/separator";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import TabWrapper from "@/pages/users/team-user/tab-wrapper";
import { UserInfoPropsStruct } from "@/pages/users/team-user/user-page-props";
import { ActivityLogPropsStruct } from "@/types/activity-log";
import { HeaderPropsStruct } from "@/types/table-header";
import { useMemo } from "react";
import { array, assign, type Infer, number, object } from "superstruct";

const UserActivityLogPropsStruct = assign(
  object({
    table: object({
      totalItems: number(),
      totalPages: number(),
      header: array(HeaderPropsStruct),
      items: array(ActivityLogPropsStruct),
    }),
  }),
  UserInfoPropsStruct
);

type UserActivityLogProps = Infer<typeof UserActivityLogPropsStruct>;

export default function ActivityLog() {
  const {
    props: { tabs, baseUrl, currentTab, tabTitle, table },
  } = useValidatedProps<UserActivityLogProps>(UserActivityLogPropsStruct);

  const tableColumns = useMemo(() => mapHeaderToColumns(table.header), [table.header]);

  return (
    <TabWrapper tabs={tabs} defaultTab={currentTab} baseUrl={baseUrl}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold text-gray-900">{tabTitle}</h2>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">{/*  Buttons placed here */}</div>
        </div>
      </div>

      <Separator />

      <DataTable
        columns={tableColumns}
        data={table.items}
        totalItems={table.totalItems}
        totalPages={table.totalPages}
        emptyState={<div>WORK IN PROGRESS</div>}
      />
    </TabWrapper>
  );
}

ActivityLog.layout = BaseLayout;
