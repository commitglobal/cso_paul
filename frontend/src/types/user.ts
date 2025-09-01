import { assign, boolean, type Infer, number, object, optional, string } from "superstruct";

export type User = Infer<typeof UserStruct>;

export const UserStruct = object({
  avatar: optional(string()),
  id: number(),
  email: string(),
  firstName: string(),
  lastName: string(),
  fullName: string(),
  roleLabel: string(),
  roleValue: string(),
  addedSince: string(),
  lastActivity: string(),
  ngohubId: number(),
});

export const UsersStruct = assign(
  object({
    isCurrentUser: boolean(),
  }),
  UserStruct
);

export type UserProps = Infer<typeof UserStruct>;
export type UsersProps = Infer<typeof UsersStruct>;
