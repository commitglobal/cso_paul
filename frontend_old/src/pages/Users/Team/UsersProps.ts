import { CommonProps } from '@/types/CommonProps';
import { User } from '@/types/User';
import {
  Infer,
  array,
  assign,
  object,
} from 'superstruct';

export type UsersProps = Infer<typeof UsersProps>;


export const UsersProps = assign(
  object({
    users: array(User),
  }),
  CommonProps,
);
