import { UserRouteType } from '@/types/User';
import { buildUrl } from '@/utils/buildUrl';
import { concat } from 'lodash';


const usersBackend = 'users';
const datastoreBackend = 'datastore';
const dashboardBackend = '';


export const apiGetUrls = {}
export const apiPostUrls = {
    userEmailLogin: buildUrl([usersBackend, 'login', 'email']),
}