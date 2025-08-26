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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiPostUrls } from "@/constants/api-urls";
import { useNotifyActions } from "@/stores/use-notify-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type TeamChangeUserRoleDialogProps = {
  userId: number;
  userName: string;
  userRole: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function TeamChangeUserRoleDialog({ userId, userName, userRole, open, setOpen }: TeamChangeUserRoleDialogProps) {
  const { t } = useTranslation();

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const { notifySuccess } = useNotifyActions();

  type RoleOption = {
    value: string;
    label: string;
    disabled: boolean;
    description: string;
  };
  const [roles, setRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/users/${userId}/roles`)
      .then((response) => response.json())
      .then((rolesData) => {
        setRoles(rolesData.roles || rolesData);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setRoles([]);
      });
  }, [open, userId]);

  const FormSchema = z.object({
    main_role: z.string().min(1, t("users.user.role.roleRequired")),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      main_role: userRole,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.post(
      `${apiPostUrls.teamChangeUserRole(userId)}?next=${window.location.pathname}${window.location.search}`,
      data,
      {
        preserveScroll: true,
        onSuccess: () => {
          notifySuccess(t("users.team.changeRole.success", { userName: userName, newRole: data.main_role }));
          handleCloseDialog();
        },
      }
    );
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={handleCloseDialog} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("users.team.changeRole.title")}</DialogTitle>
          <DialogDescription>
            Lorem ipsum.{" "}
            <Link className="font-medium text-sky-700" href="#">
              Understand user roles
            </Link>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="main_role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("users.user.role.selectLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("users.user.role.selectPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value} disabled={role.disabled}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm text-muted-foreground flex gap-2">
                    <span>{t("users.user.role.selectDescription")}</span>
                    <Link href="#" className="font-medium text-link hover:underline">
                      {t("users.user.role.selectLink")}
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCloseDialog}>
              {t("users.team.changeRole.dialog.cancel")}
            </Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {t("users.team.changeRole.dialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
