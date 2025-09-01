import { type UserProps } from "./user";

export type TeamAddUserFormData = Pick<UserProps, "firstName" | "lastName" | "email"> & {
  role?: string;
};
