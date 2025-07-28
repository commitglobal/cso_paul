import { DataTable } from "@/components/paul/data-table";
import { useValidatedProps } from "@/hooks/use-validated-props.ts";
import BaseLayout from "@/layouts/base-layout";
import { useMemo } from "react";
import { Columns } from "./columns";
import { useTranslation } from "react-i18next";
import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { InputSearch } from "@/components/ui/input-search";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import userEmptyImage from "@/assets/user-empty.svg";
import { type TeamPageProps, TeamPagePropsStruct } from "@/pages/users/team/team-page-props-struct.ts";
import { PaginationFooter } from "@/components/paul/pagination-footer";
import { QUERY_PARAM_SEARCH } from "@/constants/query-params";
import { parseAsString, useQueryState } from "nuqs";


export default function TeamPage() {
  const {
    props: {users, user_count, pagination},
  } = useValidatedProps<TeamPageProps>(TeamPagePropsStruct);

  const {t} = useTranslation();

  const tableColumns = useMemo(() => Columns(t), [t]);

const [searchString , setSearchString ] = useQueryState(QUERY_PARAM_SEARCH, parseAsString.withDefault(""));

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold text-gray-900">
              {t('users.team.title')}
            </h2>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button variant="outline" size="sm" className="gap-x-1.5">
              <ArrowPathIcon aria-hidden="true" className="h-5 w-5 -ml-0.5"/>
              {t('users.team.ngohub_refresh')}
            </Button>
            <Button variant="default" size="sm" className="gap-x-1.5">
              <UserPlusIcon aria-hidden="true" className="h-5 w-5 -ml-0.5"/>
              {t('users.team.addUser')}
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="inset-0 flex items-center px-4">
        <div className="w-full border-t border-gray-300"/>
      </div>

      <>
        <div className="flex w-full items-center gap-4 px-4 sm:px-6 xl:w-1/2 xl:px-8 2xl:1/3">
          <InputSearch
            placeholder={t('users.team.searchPlaceholder')}
            initialValue={searchString}
            onSearch={setSearchString}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label={t('users.team.filterOptions')}
            onClick={() => console.log('Filter options clicked')}
          >
            <FunnelIcon
              aria-hidden="true"
              className="h-5 w-5 text-paul-500 hover:text-paul-700 hover:fill-current"
            />
          </Button>
        </div>
      </>

      {user_count > 0 ? (
        <>
          <DataTable columns={tableColumns} data={users}/>
          <PaginationFooter totalItems={pagination.total_items} totalPages={pagination.num_pages}/>
        </>
      ) : (
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center py-16">
          <img
            src={userEmptyImage}
            alt="No users"
            className="mx-auto mb-6 h-32 w-32 object-contain text-gray-400 dark:text-gray-500"
          />
          <h2 className="mb-2 text-center text-2xl font-semibold text-gray-900">
            {t('users.team.empty.title')}
          </h2>
          <p className="mb-6 text-center text-gray-600">
            {t('users.team.empty.description')}
          </p>
          <Button variant="outline" size="sm" className="gap-x-1.5">
            <ArrowPathIcon aria-hidden="true" className="h-5 w-5 -ml-0.5"/>
            {t('users.team.ngohub_refresh')}
          </Button>
        </div>
      )}
    </div>
  );
}
TeamPage.layout = BaseLayout;
