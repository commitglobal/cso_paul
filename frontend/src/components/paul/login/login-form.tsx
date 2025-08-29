import logomark from "@/assets/paul-logomark.svg";
import { LoginRegisterCta } from "@/components/paul/login/login-register-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPostUrls } from "@/constants/api-urls";
import { LoginChoiceProps } from "@/pages/users/auth/login-choice-props";
import { handleChange } from "@/utils/handle-change";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { type FormEventHandler, useCallback } from "react";
import { useTranslation } from "react-i18next";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
  next: string | undefined;
};

export function LoginForm({ next_url }: LoginChoiceProps) {
  const {
    props: { errors },
  } = usePage();

  const { t } = useTranslation();
  const { data, setData, processing } = useForm<LoginFormData>({
    email: "",
    password: "",
    remember: false,
    next: next_url,
  });

  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      router.post(apiPostUrls.userEmailLogin, { ...data }, { preserveScroll: true });
    },
    [data]
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-row gap-2">
            <div className="flex-2/3">
              <h1 className="text-2xl font-bold">{t("login.title")}</h1>
            </div>
            <div className="flex-1/3">
              <img alt="PAUL" src={logomark} className="ml-auto h-8 w-auto" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">{t("login.input.emailTitle")}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=""
                  required
                  onChange={handleChange<LoginFormData>("email", setData)}
                  aria-invalid={errors?.login?.email ? "true" : "false"}
                  aria-describedby={errors?.login?.email ? "email_errors" : ""}
                  className={errors?.login?.email && "border-destructive"}
                  value={data.email}
                />
                {errors?.login?.email && (
                  <p id="email_errors" className="text-destructive text-sm">
                    {errors.login.email}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">{t("login.input.passwordTitle")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange<LoginFormData>("password", setData)}
                  aria-invalid={errors?.login?.password ? "true" : "false"}
                  aria-describedby={errors?.login?.password ? "password_errors" : ""}
                  className={errors?.login?.password && "aria-invalid:border-destructive"}
                  value={data.password}
                />
                {errors?.login?.password && (
                  <p id="password_errors" className="text-destructive text-sm">
                    {errors.login.password}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="remember" className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={data.remember}
                    onCheckedChange={(checked) => setData("remember", !!checked)}
                  />
                  {t("login.input.rememberMe")}
                </Label>

                <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 underline">
                  {t("login.forgotPassword")}
                </Link>
              </div>

              <Input id="next" type="hidden" name="next" placeholder="" value={next_url} />

              <Button type="submit" disabled={processing} className="w-full">
                {t("login.loginPrompt")}
              </Button>
            </div>
            <LoginRegisterCta />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
