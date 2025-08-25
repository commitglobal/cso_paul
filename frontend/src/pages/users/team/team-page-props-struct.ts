import { Breadcrumb } from "@/types/breadcrumb";
import { CommonProps } from "@/types/common-props";
import { Filters } from "@/types/filter";
import { Pagination } from "@/types/pagination";
import { array, assign, boolean, type Infer, number, object, string } from "superstruct";

// TODO: This should be moved to types/user.ts when the user types are more in place
const UserStruct = object({
  id: number(),
  email: string(),
  name: string(),
  first_name: string(),
  last_name: string(),
  role: string(),
  is_current_user: boolean(),
  added_since: string(),
  last_activity: string(),
  ngohub_id: number(),
});

export const TeamPagePropsStruct = assign(
  object({
    title: string(),
    description: string(),
    breadcrumbs: array(Breadcrumb),
    search_query: string(),
    users: array(UserStruct),
    pagination: Pagination,
    filters: Filters,
    is_ngohub_auth_enabled: boolean(),
    is_email_auth_enabled: boolean(),
    is_add_user_button_enabled: boolean(),
  }),
  CommonProps
);

export type UserProps = Infer<typeof UserStruct>;
export type TeamPageProps = Infer<typeof TeamPagePropsStruct>;
