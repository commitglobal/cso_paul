import {
  type Infer,
  any,
  array,
  boolean,
  nullable,
  object,
  optional,
  string,
} from 'superstruct';
import { User } from './user';
import { FlashMessage } from './flash-message';

export type CommonProps = Infer<typeof CommonProps>;

export const CommonProps = object({
  errors: optional(nullable(any())),
  flash_messages: optional(array(FlashMessage)),
  has_add_permission: optional(boolean()),
  has_change_permission: optional(boolean()),
  is_authenticated: optional(boolean()),
  language: optional(string()),
  user: optional(nullable(User)),
});
