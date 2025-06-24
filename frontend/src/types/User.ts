import {
  type Infer,
  array,
  boolean,
  number,
  object,
  optional,
  string,
} from 'superstruct';

export type User = Infer<typeof User>;

export const User = object({
  avatar: optional(string()),
  email: string(),
  first_name: string(),
  id: number(),
  is_active: boolean(),
  last_name: string(),
  last_login: optional(string()),
  date_joined: optional(string()),
  groups: optional(array()),
  user_permissions: optional(array()),
  is_admin_super: optional(boolean()),
  is_admin_basic: optional(boolean()),
  is_admin_ngo: optional(boolean()),
  is_user: optional(boolean()),
});

export type UserType = 'admin_super'  | 'admin_basic' | 'admin_ngo' | 'user';
