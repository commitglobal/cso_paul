import { useForm } from '@inertiajs/react';
import { type TeamUserFormData } from '@/types/team-user-form-data';

const defaultFormData: TeamUserFormData = {
  first_name: '',
  last_name: '',
  email: '',
};

export function useTeamUserForm(edition?: TeamUserFormData) {
  return useForm<TeamUserFormData>({ ...defaultFormData, ...edition });
}
