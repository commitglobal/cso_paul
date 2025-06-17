import { CommonProps } from '@/types/CommonProps';
import {
  Infer,
  assign,
  object,
  string,
  boolean,
} from 'superstruct';


export const LoginChoiceProps = assign(
  object({
    endpoints: object({
      ngohub: boolean(),
      ngohub_url: string(),
      email: boolean(),
      email_url: string(),
    }),
  }),
  CommonProps,
);

export type LoginChoiceProps = Infer<typeof LoginChoiceProps>;
