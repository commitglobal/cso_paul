import { any, array, assign, boolean, type Infer, nullable, object, optional, string } from "superstruct";
import { FlashMessage } from "./flash-message";
import { UserStruct } from "./user";

export const CommonPropsBlank = object({
  errors: optional(nullable(any())),
  flashMessages: optional(array(FlashMessage)),
  isAuthenticated: optional(boolean()),
  language: optional(string()),
});

export const CommonProps = assign(
  CommonPropsBlank,
  object({
    user: UserStruct,
  })
);

export type CommonPropsBlank = Infer<typeof CommonPropsBlank>;
export type CommonProps = Infer<typeof CommonProps>;
