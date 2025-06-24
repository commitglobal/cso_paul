import {
  type Infer,
  any,
  array,
  boolean,
  nullable,
  object,
  optional,
} from 'superstruct';
import { User } from './User';
import { FlashMessage } from './FlashMessage';

export type CommonProps = Infer<typeof CommonProps>;

export const CommonProps = object({
  errors: optional(nullable(any())),
  flash_messages: optional(array(FlashMessage)),
  has_add_permission: optional(boolean()),
  has_change_permission: optional(boolean()),
  is_authenticated: optional(boolean()),
  user: optional(nullable(User)),
});
