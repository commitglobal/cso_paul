import { CommonProps } from '@/types/common-props';
import {
  type Infer,
  assign,
  boolean,
  object,
  optional,
  string,
} from 'superstruct';


export const LoginChoiceProps = assign(
  object({
    endpoints: object({
      ngohub: boolean(),
      ngohub_url: string(),
      email: boolean(),
      email_url: string(),
    }),
    next_url: optional(string()),
  }),
  CommonProps,
);

export type LoginChoiceProps = Infer<typeof LoginChoiceProps>;
