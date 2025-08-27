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
import { apiPostUrls } from "@/constants/api-urls";
import { useTeamAddUserForm } from "@/hooks/use-team-add-user-form";
import { useNotifyActions } from "@/stores/use-notify-store";
import { UserPlusIcon } from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/react";
import * as React from "react";
import { type FormEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TeamAddUserForm } from "../forms/team-add-user-form";

export function TeamAddUserDialog() {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, []);
  const handleOpenDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const { data, post, processing, reset, setData } = useTeamAddUserForm();

  const { notifySuccess } = useNotifyActions();
  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      post(apiPostUrls.teamAddUser, {
        preserveScroll: true,
        onSuccess: () => {
          notifySuccess("Ediția a fost creată cu succes");
          handleCloseDialog();
          reset();
        },
      });
    },
    [notifySuccess, handleCloseDialog, post, reset]
  );

  return (
    <>
      <Button variant="default" size="sm" className="gap-x-1.5" onClick={handleOpenDialog}>
        <UserPlusIcon aria-hidden="true" className="h-5 w-5 -ml-0.5" />
        {t("users.team.addUser")}
      </Button>

      <Dialog open={open}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("users.team.addUser")}</DialogTitle>
            <DialogDescription>
              Lorem ipsum.{" "}
              <Link className="font-medium text-sky-700" href="#">
                Understand user roles
              </Link>
            </DialogDescription>
          </DialogHeader>
          <TeamAddUserForm data={data} handleSubmit={handleSubmit} setData={setData} />
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={processing} variant="outline" onClick={handleCloseDialog}>
                {t("dialog.cancel")}
              </Button>
            </DialogClose>
            <Button disabled={processing} type="submit" onClick={handleSubmit}>
              {t("dialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
