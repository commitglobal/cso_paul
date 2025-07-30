import { type FormEventHandler } from 'react';
import { type TeamUserFormData } from '@/types/team-user-form-data';
import { handleChange } from '@/utils/handle-change';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next";


type TeamUserFormProps = {
  data: TeamUserFormData;
  errors: Record<string, string>;
  handleSubmit: FormEventHandler;
  setData: (key: keyof TeamUserFormData, value: unknown) => void;
};

export function TeamUserForm({
  data,
  // errors,
  handleSubmit,
  setData,
}: TeamUserFormProps) {

  const {t} = useTranslation();

  return (
    <form className='' onSubmit={handleSubmit}>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="first_name">{t('users.team.add.firstName')}</Label>
          <Input 
          // TODO: errors={errors?.first_name}
            id="first_name" 
            name="first_name" 
            defaultValue="" 
            value={data.first_name} 
            onChange={handleChange<TeamUserFormData>('first_name', setData)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="last_name">{t('users.team.add.lastName')}</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            defaultValue="" 
            value={data.last_name} 
            onChange={handleChange<TeamUserFormData>('last_name', setData)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">{t('users.team.add.email')}</Label>
          <Input 
            id="email" 
            name="email" 
            defaultValue="" 
            value={data.email} 
            onChange={handleChange<TeamUserFormData>('email', setData)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="role">{t('users.team.add.userRole')}</Label>
          <Input id="role" name="role" defaultValue="" />
        </div>
      </div>
    </form>
  );
}

