import { useForm } from "@inertiajs/react";
import { type TeamAddUserFormData } from "@/types/team-add-user-form-data";

const defaultFormData: TeamAddUserFormData = {
  first_name: "",
  last_name: "",
  email: "",
};

export function useTeamAddUserForm(userData?: TeamAddUserFormData) {
  return useForm<TeamAddUserFormData>({ ...defaultFormData, ...userData });
}
