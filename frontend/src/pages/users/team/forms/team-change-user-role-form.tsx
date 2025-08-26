import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeamChangeUserRoleFormData } from "@/types/team-change-user-role-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@inertiajs/react";
import { type FormEventHandler } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type TeamUserFormProps = {
  data: TeamChangeUserRoleFormData;
  handleSubmit: FormEventHandler;
  // setData: (key: keyof TeamChangeUserRoleFormData, value: unknown) => void;
  roles: {
    value: string;
    label: string;
    disabled: boolean;
    description: string;
  }[];
};

export function TeamChangeUserRoleForm({ data, handleSubmit, roles }: TeamUserFormProps) {
  const { t } = useTranslation();

  const FormSchema = z.object({
    main_role: z.string().min(1, t("users.user.role.roleRequired")),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      main_role: data.role,
    },
  });

  console.log("roles", roles)

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="flex justify-start gap-2">
          <Button variant="outline" type="reset">
            {t("users.user.role.buttonCancel")}
          </Button>
          <Button type="submit">{t("users.user.role.buttonSubmit")}</Button>
        </div>
      </form>
    </Form>
  );
}
