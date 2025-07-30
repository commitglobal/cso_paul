import { buildUrl } from '@/utils/build-url';
import { concat } from 'lodash';

function buildUrlFactory(baseUrl: string[]) {
  return (urlPathStrings: (string | number)[] = []) =>
    buildUrl(concat(baseUrl, urlPathStrings));
}

const buildUsersUrl = buildUrlFactory(['users']);
const buildTeamUrl = buildUrlFactory(['users', 'team']);

export const apiGetUrls = {
  teamIndex: buildTeamUrl([]),
};

export const apiPostUrls = {
  teamAddUser: buildTeamUrl(),
  userEmailLogin: buildUsersUrl(['login', 'email']),
  userLogout: () => buildUsersUrl(['logout']),
};
