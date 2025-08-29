import { useForm } from "@inertiajs/react";
import { type TeamAddUserFormData } from "@/types/team-add-user-form-data";

const defaultFormData: TeamAddUserFormData = {
  firstName: "",
  lastName: "",
  email: "",
};

export function useTeamAddUserForm(userData?: TeamAddUserFormData) {
  return useForm<TeamAddUserFormData>({ ...defaultFormData, ...userData });
}
