import { CommonProps } from "@/types/common-props";
import { TabProps } from "@/types/tabProps";
import { array, assign, type Infer, object, string } from "superstruct";

export const UserPageProps = assign(
  object({
    tabs: TabProps,
  }),
  CommonProps
);

export type UserPageProps = Infer<typeof UserPageProps>;

export const UserInfoPropsStruct = object({
  currentTab: string(),
  tabTitle: string(),
  baseUrl: string(),
  props: array(
    object({
      label: string(),
      value: string(),
    })
  ),
  tabs: array(
    object({
      label: string(),
      value: string(),
    })
  ),
});

export type UserInfoProps = Infer<typeof UserInfoPropsStruct>;
