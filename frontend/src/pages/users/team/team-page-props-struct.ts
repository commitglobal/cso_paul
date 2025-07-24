import { CommonProps } from '@/types/common-props';
import {
  type Infer,
  assign,
  object,
  string,
  number,
  boolean,
  array,
} from 'superstruct';
import { Breadcrumb } from "@/types/breadcrumb.ts";
import { Pagination } from "@/types/pagination.ts";

// TODO: This should be moved to types/user.ts when the user types are more in place
const UserStruct = object({
  id: number(),
  email: string(),
  first_name: string(),
  last_name: string(),
  role: string(),
  is_current_user: boolean(),
  added_since: string(),
  last_activity: string(),
});

export const TeamPagePropsStruct = assign(
  object({
    title: string(),
    description: string(),
    user_count: number(),
    breadcrumbs: array(Breadcrumb),
    search_query: string(),
    users: array(UserStruct),
    pagination: Pagination,
  }),
  CommonProps,
);

export type UserProps = Infer<typeof UserStruct>;
export type TeamPageProps = Infer<typeof TeamPagePropsStruct>;
