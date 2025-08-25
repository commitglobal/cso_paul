import type { TeamRemoveUserFormData } from "@/types/team-remove-user-form-data";
import { useForm } from "@inertiajs/react";

const defaultFormData: TeamRemoveUserFormData = {
  id: 0,
};

export function useTeamRemoveUserForm(userData?: TeamRemoveUserFormData) {
  return useForm<TeamRemoveUserFormData>({ ...defaultFormData, ...userData });
}
