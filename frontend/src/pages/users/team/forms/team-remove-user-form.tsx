import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useValidatedProps } from "@/hooks/use-validated-props";
import type { TeamRemoveUserFormData } from "@/types/team-remove-user-form-data";
import { handleChange } from "@/utils/handle-change";
import { type FormEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { TeamUserProps } from "../team-user-props";

type TeamRemoveUserFormProps = {
  data: TeamRemoveUserFormData;
  handleSubmit: FormEventHandler;
  setData: (key: keyof TeamRemoveUserFormData, value: unknown) => void;
};

export function TeamRemoveUserForm({ data, handleSubmit, setData }: TeamRemoveUserFormProps) {
  const {
    props: { errors },
  } = useValidatedProps<TeamUserProps>(TeamUserProps);

  const { t } = useTranslation();

  return (
    <form className="" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label className="sr-only" htmlFor="pk">
            {t("users.team.removeUser.formLabel")}
          </Label>
          <Input
            hidden
            id="pk"
            name="pk"
            value={data.id}
            onChange={handleChange<TeamRemoveUserFormData>("id", setData)}
          />
          {errors?.team?.id && (
            <p id="id_errors" className="text-destructive text-sm">
              {errors.team.id}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
