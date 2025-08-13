import { Separator } from "@/components/ui/separator";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import TabWrapper from "@/pages/users/team-user/tab-wrapper";
import { type UserInfoProps, UserInfoPropsStruct } from "@/pages/users/team-user/user-page-props";

export default function Info() {
  const {
    props: { tabs, baseUrl, currentTab, tabTitle, props },
  } = useValidatedProps<UserInfoProps>(UserInfoPropsStruct);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
        {props.map((prop) => (
          <div className="text-sm">
            <div className="text-sm font-normal text-gray-500">{prop.label}</div>
            <div className="font-medium text-gray-900">{prop.value}</div>
          </div>
        ))}
      </div>
    </TabWrapper>
  );
}

Info.layout = BaseLayout;
