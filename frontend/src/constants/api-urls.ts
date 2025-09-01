import { buildUrl } from "@/utils/build-url";
import { concat } from "lodash";

function buildUrlFactory(baseUrl: string[]) {
  return (urlPathStrings: (string | number)[] = []) => buildUrl(concat(baseUrl, urlPathStrings));
}

const buildUsersUrl = buildUrlFactory(["users"]);
const buildTeamUrl = buildUrlFactory(["users", "team"]);
const buildNGOHubRefreshUrl = buildUrlFactory(["users", "team", "ngohub-refresh"]);

const buildTeamUserUrl = buildUrlFactory(["users", "team"]);

const buildDatasetUrl = buildUrlFactory(["datasets"]);

export const apiGetUrls = {
  teamIndex: buildTeamUrl([]),
  ngohubRefresh: buildNGOHubRefreshUrl([]),
  datasetIndex: buildDatasetUrl([]),
};

export const apiPostUrls = {
  teamAddUser: buildTeamUrl(),
  teamChangeUserRole: (id: number) => buildTeamUserUrl([id, "role"]),
  userEmailLogin: buildUsersUrl(["login", "email"]),
  userLogout: () => buildUsersUrl(["logout"]),
};

export const apiDeleteUrls = {
  teamUserRemove: (id: number) => buildTeamUserUrl([id, "remove"]),
};
