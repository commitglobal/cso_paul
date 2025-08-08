import { CommonProps } from "@/types/common-props";
import { assign, type Infer, object, optional, string } from "superstruct";

export const NgohubLoginProps = assign(
  object({
    redirect_endpoint: string(),
    provider: string(),
    process: string(),
    callback_url: string(),
    csrf_token: string(),
    next_url: optional(string()),
  }),
  CommonProps
);

export type NgohubLoginProps = Infer<typeof NgohubLoginProps>;
