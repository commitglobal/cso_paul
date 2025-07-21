import { DataTable } from "@/components/ui/data-table";
import { useValidatedProps } from "@/hooks/use-validated-props.ts";
import BaseLayout from "@/layouts/base-layout.tsx";
import { LoginChoiceProps } from "@/pages/users/auth/login-choice-props.ts";
import { useMemo } from "react";
import { Columns, type User } from "./columns";
import { useTranslation } from "react-i18next";
import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { InputSearch } from "@/components/ui/input-search.tsx";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button.tsx";


export default function TeamPage() {
  const {
    props: {users},
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  const {t} = useTranslation();

  const tableColumns = useMemo(() => Columns("ion"), []);

  console.log("We have users data:", users);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold text-gray-900">
              {t('users.team.title')}
            </h2>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button variant="outline" size="sm" className="gap-x-1.5">
              <ArrowPathIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
              {t('users.team.ngohub_refresh')}
            </Button>
            <Button variant="default" size="sm" className="gap-x-1.5">
              <UserPlusIcon aria-hidden="true" className="-ml-0.5 h-5 w-5"/>
              {t('users.team.addUser')}
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="inset-0 flex items-center px-4">
        <div className="w-full border-t border-gray-300"/>
      </div>

      <div className="flex gap-4 items-center px-4 sm:px-6 lg:px-8">
        <InputSearch/>
        <FunnelIcon className="h-5 w-5 cursor-pointer text-paul-500 hover:text-paul-700 hover:fill-current"/>
      </div>

      <DataTable columns={tableColumns} data={users as User[]}/>
    </div>
  );
}

TeamPage.layout = BaseLayout;
