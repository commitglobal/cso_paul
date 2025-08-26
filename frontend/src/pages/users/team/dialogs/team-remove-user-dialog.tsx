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
import { apiDeleteUrls } from "@/constants/api-urls";
import { useNotifyActions } from "@/stores/use-notify-store";
import { Link, useForm } from "@inertiajs/react";
import { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";

type TeamRemoveUserDialogProps = {
  userId: number;
  userName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  isNgoHubUser: boolean;
};

export function NgoHubDialogDescription({ userName }: { userName: string }) {
  const { t } = useTranslation();
  return (
    <span className="flex flex-col gap-2">
      <span>
        <Trans
          i18nKey="users.team.removeUser.ngohub.description"
          values={{
            userName,
            ngoHubTitle: t("ngohub.title"),
          }}
          components={{
            userName: <span className="font-semibold" />,
            ngoHubLink: <Link href="https://app.ngohub.ro" className="font-medium text-sky-700 hover:underline" />,
          }}
        />
      </span>
      <span className="mt-2">
        <Link href="#" className="font-medium text-sky-700">
          <Trans i18nKey="users.team.removeUser.ngohub.callToAction" values={{ userName }} />
        </Link>
      </span>
    </span>
  );
}

export function DeleteDialogDescription({ userName }: { userName: string }) {
  return (
    <span className="flex flex-col gap-2">
      <span>
        <Trans
          i18nKey="users.team.removeUser.local.description"
          values={{
            userName,
          }}
          components={{
            userName: <span className="font-semibold" />,
          }}
        />
      </span>
      <span className="mt-2">
        <Link href="#" className=" font-medium text-sky-700">
          <Trans i18nKey="users.team.removeUser.local.callToAction" values={{ userName }} />
        </Link>
      </span>
    </span>
  );
}

export function TeamRemoveUserDialog({ userId, userName, open, setOpen, isNgoHubUser }: TeamRemoveUserDialogProps) {
  const { t } = useTranslation();

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const form = useForm();

  const { notifySuccess } = useNotifyActions();

  const handleDeleteUser = useCallback(
    (userId: number) => () =>
      form.delete(`${apiDeleteUrls.teamUserRemove(userId)}?next=${window.location.pathname}${window.location.search}`, {
        onSuccess: () => {
          notifySuccess(t("users.team.removeUser.notifications.success"));
          handleCloseDialog();
        },
      }),
    [form, notifySuccess, t, handleCloseDialog]
  );

  const dialogDescription = isNgoHubUser ? (
    <NgoHubDialogDescription userName={userName} />
  ) : (
    <DeleteDialogDescription userName={userName} />
  );

  const confirmButton = isNgoHubUser ? (
    <Button type="submit" asChild>
      <Link href={`/home`}>{t("users.team.removeUser.dialog.goToFiles")}</Link>
    </Button>
  ) : (
    <Button type="submit" onClick={handleDeleteUser(userId)}>
      {t("users.team.removeUser.dialog.confirm")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("users.team.removeUser.title", { userName: userName })}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCloseDialog}>
              {t("users.team.removeUser.dialog.cancel")}
            </Button>
          </DialogClose>
          {confirmButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
