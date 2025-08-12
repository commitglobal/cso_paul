import { DataTable } from "@/components/data-table/data-table";
import { Separator } from "@/components/ui/separator";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import { ColumnsActivityLog } from "@/pages/users/team-user/columns-activity-log";
import TabWrapper from "@/pages/users/team-user/tab-wrapper";
import { type UserInfoProps, UserInfoPropsStruct } from "@/pages/users/team-user/user-page-props";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function ActivityLog() {
  const { t } = useTranslation();
  const {
    props: { tabs, baseUrl, value, label },
  } = useValidatedProps<UserInfoProps>(UserInfoPropsStruct);

  const tableColumns = useMemo(() => ColumnsActivityLog(t), [t]);

  return (
    <TabWrapper tabs={tabs} defaultTab={value} baseUrl={baseUrl}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold text-gray-900">{label}</h2>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">{/*  Buttons placed here */}</div>
        </div>
      </div>

      <Separator />

      <DataTable
        columns={tableColumns}
        data={[]}
        totalItems={10}
        totalPages={10}
        emptyState={<div>WORK IN PROGRESS</div>}
      />
    </TabWrapper>
  );
}

ActivityLog.layout = BaseLayout;
