import { type FormEventHandler } from 'react';
import { type TeamUserFormData } from '@/types/team-user-form-data';
import { handleChange } from '@/utils/handle-change';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from '@/components/ui/select';
import { useTranslation } from "react-i18next";
// import { usePage } from '@inertiajs/react';
import { useValidatedProps } from '@/hooks/use-validated-props';
import { TeamUserProps } from './team-user-props';

type TeamUserFormProps = {
  data: TeamUserFormData;
  handleSubmit: FormEventHandler;
  setData: (key: keyof TeamUserFormData, value: unknown) => void;
};

export function TeamUserForm({
  data,
  handleSubmit,
  setData,
}: TeamUserFormProps) {

  const {
    props: { errors, role_choices }
  } = useValidatedProps<TeamUserProps>(TeamUserProps);
  
  const {t} = useTranslation();

  return (
    <form className='' onSubmit={handleSubmit}>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="first_name">{t('users.team.add.firstName')}</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={data.first_name} 
            onChange={handleChange<TeamUserFormData>('first_name', setData)}
          />
          {errors?.team?.first_name &&
            <p id='first_name_errors' className='text-destructive text-sm'>{errors.team.first_name}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="last_name">{t('users.team.add.lastName')}</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            value={data.last_name} 
            onChange={handleChange<TeamUserFormData>('last_name', setData)}
          />
          {errors?.team?.last_name &&
            <p id='last_name_errors' className='text-destructive text-sm'>{errors.team.last_name}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">{t('users.team.add.email')}</Label>
          <Input 
            id="email" 
            name="email" 
            value={data.email} 
            onChange={handleChange<TeamUserFormData>('email', setData)}
          />
          {errors?.team?.email &&
            <p id='email_errors' className='text-destructive text-sm'>{errors.team.email}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="role">{t('users.team.add.userRole')}</Label>
          <Select name="role">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {role_choices?.map((role) => (
                <SelectItem value={`${role.value}`} key={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.team?.role &&
            <p id='role_errors' className='text-destructive text-sm'>{errors.team.role}</p>}
        </div>
      </div>
    </form>
  );
}

