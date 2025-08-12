import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import { PermissionsColumns } from "@/pages/users/team-user/permissions-columns";
import TabWrapper from "@/pages/users/team-user/tab-wrapper";
import { type UserInfoProps, UserInfoPropsStruct } from "@/pages/users/team-user/user-page-props";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function Permissions() {
  const { t } = useTranslation();

  const {
    props: { tabs, baseUrl, value, label },
  } = useValidatedProps<UserInfoProps>(UserInfoPropsStruct);

  const tableColumns = useMemo(() => PermissionsColumns(t), [t]);

  return (
    <TabWrapper tabs={tabs} defaultTab={value} baseUrl={baseUrl}>
      <div className="flex flex-col gap-4 py-4 ">
        <TabsContent value={value}>
          <div className="flex flex-col gap-4 py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h2 className="text-base font-semibold text-gray-900">{label}</h2>
                </div>
                <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <Button variant="default" size="sm" className="gap-x-1.5">
                    <PlusIcon aria-hidden="true" className="h-5 w-5 -ml-0.5" />
                    {t("users.user.addPermission")}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

              <DataTable
                columns={tableColumns}
                data={[]}
                totalItems={10}
                totalPages={10}
                emptyState={<div>NOTHING</div>}
              />
          </div>
        </TabsContent>
      </div>
    </TabWrapper>
  );
}

Permissions.layout = BaseLayout;
