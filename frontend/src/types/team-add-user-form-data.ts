import { User } from "./user";

export type TeamAddUserFormData = Pick<User, "first_name" | "last_name" | "email"> & {
  role?: string;
};
