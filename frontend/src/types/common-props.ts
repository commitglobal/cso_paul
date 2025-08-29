import { any, array, boolean, type Infer, nullable, object, optional, string } from "superstruct";
import { FlashMessage } from "./flash-message";
import { UserStruct } from "./user";

export const CommonProps = object({
  errors: optional(nullable(any())),
  flashMessages: optional(array(FlashMessage)),
  isAuthenticated: optional(boolean()),
  language: optional(string()),
  user: optional(nullable(UserStruct)),
});

export type CommonProps = Infer<typeof CommonProps>;
