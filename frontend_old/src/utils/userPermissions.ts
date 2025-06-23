import { User, UserType } from '@/types/User';

export function isAdminSuper(user: User) {
  return user.is_admin_super;
}

export function isAdminBasic(user: User) {
  return user.is_admin_basic;
}

export function isAdminNgo(user: User) {
  return user.is_admin_ngo;
}


export function getUserType(user: User): UserType {
  if (isAdminSuper(user)) {
    return 'admin_super';
  }

  if (isAdminBasic(user)) {
    return 'admin_basic';
  }

  if (isAdminNgo(user)) {
    return 'admin_ngo';
  }

  return 'user';
}
