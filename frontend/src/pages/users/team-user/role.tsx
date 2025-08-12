"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BaseLayout from "@/layouts/base-layout";
import TabWrapper from "@/pages/users/team-user/tab-wrapper";
import { UserInfoPropsStruct } from "@/pages/users/team-user/user-page-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { array, assign, boolean, type Infer, object, string } from "superstruct";
import { z } from "zod";

const UserRolePropsStruct = assign(
  object({
    userRole: string(),
    roles: array(
      object({
        value: string(),
        label: string(),
        disabled: boolean(),
        description: string(),
      })
    ),
    roleDescriptions: array(
      object({
        value: string(),
        label: string(),
        description: string(),
      })
    ),
  }),
  UserInfoPropsStruct
);

type UserRoleProps = Infer<typeof UserRolePropsStruct>;

export default function Role() {
  const {
    props: { tabs, baseUrl, value, label, roles, userRole },
  } = useValidatedProps<UserRoleProps>(UserRolePropsStruct);

  const { t } = useTranslation();

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
    router.post(window.location.pathname, data, { preserveScroll: true });
  }

  return (
    <TabWrapper tabs={tabs} defaultTab={value} baseUrl={baseUrl}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-base font-semibold text-gray-900">{label}</h2>
          </div>
          <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">{/*  Buttons placed here */}</div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
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
              <div className="flex justify-start gap-2">
                <Button variant="outline" type="reset">
                  {t("users.user.role.buttonCancel")}
                </Button>
                <Button type="submit">{t("users.user.role.buttonSubmit")}</Button>
              </div>
            </form>
          </Form>
        </div>
        <div>
          {(() => {
            const selectedRole = form.watch("main_role");
            const roleDescription = roles.find((role) => role.value === selectedRole);
            if (!roleDescription) {
              return (
                <>
                  <h3 className="text-lg font-semibold mb-2">{t("users.user.role.noRoleTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("users.user.role.noRoleDescription")}</p>
                </>
              );
            }
            return (
              <>
                <h3 className="text-lg font-semibold mb-2">{roleDescription.label}</h3>
                <p className="text-sm text-muted-foreground">{roleDescription.description}</p>
              </>
            );
          })()}
        </div>
      </div>
    </TabWrapper>
  );
}

Role.layout = BaseLayout;
