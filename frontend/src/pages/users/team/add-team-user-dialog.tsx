import { type FormEventHandler, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";
import { TeamUserForm } from "./team-user-form";
import { useNotifyActions } from "@/stores/use-notify-store";
import { useTeamUserForm } from "@/hooks/use-team-user-form";
import { apiPostUrls } from "@/constants/api-urls";

type AddTeamUserDialogProps = {
  onClose: () => void;
  open: boolean;
};

export function AddTeamUserDialog({ onClose, open }: AddTeamUserDialogProps) {
  const { data, post, processing, reset, setData } = useTeamUserForm();
  const { t } = useTranslation();

  const { notifySuccess } = useNotifyActions();
  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      post(apiPostUrls.teamAddUser, {
        preserveScroll: true,
        onSuccess: () => {
          notifySuccess("Ediția a fost creată cu succes");
          onClose();
          reset();
        },
      });
    },
    [notifySuccess, onClose, post, reset]
  );

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("users.team.addUser")}</DialogTitle>
          <DialogDescription>
            Lorem ipsum. <Link href="#">Understand user roles</Link>
          </DialogDescription>
        </DialogHeader>
        <TeamUserForm data={data} handleSubmit={handleSubmit} setData={setData} />
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={processing} variant="outline" onClick={onClose}>
              {t("dialog.cancel")}
            </Button>
          </DialogClose>
          <Button disabled={processing} type="submit" onClick={handleSubmit}>
            {t("dialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
