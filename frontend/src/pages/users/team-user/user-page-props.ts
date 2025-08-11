import { CommonProps } from "@/types/common-props";
import { TabProps } from "@/types/tabProps";
import { assign, type Infer, object } from "superstruct";

export const UserPageProps = assign(
  object({
    tabs: TabProps,
  }),
  CommonProps
);

export type UserPageProps = Infer<typeof UserPageProps>;
