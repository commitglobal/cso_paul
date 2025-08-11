import { CommonProps } from '@/types/common-props';
import { SelectOption } from '@/types/select-option';
import {
  type Infer,
  array,
  assign,
  object,
} from 'superstruct';


export type TeamUserProps = Infer<typeof TeamUserProps>;

export const TeamUserProps = assign(
  object({
    role_choices: array(SelectOption),
  }),
  CommonProps,
);
