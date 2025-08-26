import type { TeamChangeUserRoleFormData } from "@/types/team-change-user-role-form-data";
import { useForm } from "@inertiajs/react";

const defaultFormData: TeamChangeUserRoleFormData = {
  role: "",
};

export function useTeamChangeUserRoleForm(userData?: TeamChangeUserRoleFormData) {
  return useForm<TeamChangeUserRoleFormData>({ ...defaultFormData, ...userData });
}
