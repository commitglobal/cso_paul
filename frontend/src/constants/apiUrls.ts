import { UserRouteType } from '@/types/User';
import { buildUrl } from '@/utils/buildUrl';
import { concat } from 'lodash';


const usersBackend = 'users';
const datastoreBackend = 'datastore';
const dashboardBackend = '';


function buildUrlFactory(baseUrl: string[]) {
  return (urlPathStrings: (string | number)[] = []) =>
    buildUrl(concat(baseUrl, urlPathStrings));
}

const buildUsersUrl = buildUrlFactory([usersBackend]);

export const apiGetUrls = {}
export const apiPostUrls = {
    userEmailLogin: buildUsersUrl(['login', 'email']),
}