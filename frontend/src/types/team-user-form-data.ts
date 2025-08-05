import { User } from './user';

export type TeamUserFormData = Pick<
  User,
  | 'first_name'
  | 'last_name'
  | 'email'
//   TODO: user role
>;
