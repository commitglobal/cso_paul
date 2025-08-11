import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import { MainContent } from "@/layouts/main-content";
import GenericTab from "@/pages/users/team-user/tab-user";
import { UserPageProps } from "@/pages/users/team-user/user-page-props";

export default function UserPage() {
  const {
    props: { tabs },
  } = useValidatedProps<UserPageProps>(UserPageProps);

  return (
    <Tabs defaultValue={tabs.default} className="flex items-center">
      <TabsList className="grid w-1/3 grid-cols-3">
        {tabs.items.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <MainContent>
        <div className="flex flex-col gap-4 py-4 ">
          {tabs.items.map((tab) => (
            <GenericTab tab={tab} />
          ))}

          {/*/!* Default tab content, if needed *!/*/}
          {/*<GenericTab tab={tabs.items[0]} />*/}
          {/*<UserPermissionsTab value="permissions" />*/}
          {/*<UserActivityTab value="activity_log" />*/}
        </div>
      </MainContent>
    </Tabs>
  );
}

UserPage.layout = BaseLayout;
