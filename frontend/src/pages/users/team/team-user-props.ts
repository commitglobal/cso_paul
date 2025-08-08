import { CommonProps } from '@/types/common-props';
import { SelectOption } from '@/types/select-option';
import {
  type Infer,
  array,
  assign,
  number,
  object,
  optional,
  string,
} from 'superstruct';


export type TeamUserProps = Infer<typeof TeamUserProps>;

export const TeamUserProps = assign(
  object({
    role_choices: array(SelectOption),
  }),
  CommonProps,
);
