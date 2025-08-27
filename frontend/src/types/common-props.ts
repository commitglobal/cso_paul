import { type Infer, any, array, boolean, nullable, object, optional, string } from "superstruct";
import { User } from "./user";
import { FlashMessage } from "./flash-message";

export type CommonProps = Infer<typeof CommonProps>;

export const CommonProps = object({
  errors: optional(nullable(any())),
  flashMessages: optional(array(FlashMessage)),
  isAuthenticated: optional(boolean()),
  language: optional(string()),
  user: optional(nullable(User)),
});
