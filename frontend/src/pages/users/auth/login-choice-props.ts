import { CommonProps } from "@/types/common-props";
import { assign, boolean, type Infer, object, optional, string } from "superstruct";

export const LoginChoiceProps = assign(
  object({
    endpoints: object({
      is_ngohub_auth_enabled: boolean(),
      ngohub_url: string(),
      is_email_auth_enabled: boolean(),
      email_url: string(),
    }),
    next_url: optional(string()),
  }),
  CommonProps
);

export type LoginChoiceProps = Infer<typeof LoginChoiceProps>;
