import {
  Infer,
  array,
  boolean,
  nullable,
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
});
