import { Breadcrumb } from "@/types/breadcrumb";
import { CommonProps } from "@/types/common-props";
import { Filters } from "@/types/filter";
import { Pagination } from "@/types/pagination";
import { UsersStruct } from "@/types/user";
import { array, assign, boolean, type Infer, object, string } from "superstruct";

export const TeamPagePropsStruct = assign(
  object({
    title: string(),
    description: string(),
    breadcrumbs: array(Breadcrumb),
    search_query: string(),
    users: array(UsersStruct),
    pagination: Pagination,
    filters: Filters,
    is_ngohub_auth_enabled: boolean(),
    is_email_auth_enabled: boolean(),
    is_add_user_button_enabled: boolean(),
  }),
  CommonProps
);

export type TeamPageProps = Infer<typeof TeamPagePropsStruct>;
