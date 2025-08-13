import logomark from "@/assets/paul-logomark.svg";
import { LoginRegisterCta } from "@/components/paul/login-register-cta";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoginChoiceProps } from "@/pages/users/auth/login-choice-props";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export function LoginChoiceForm({ endpoints, next_url }: LoginChoiceProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <div className="flex flex-row gap-2">
            <div className="flex-2/3">
              <h1 className="text-2xl font-bold">{t("loginChoice.loginTitle")}</h1>
            </div>
            <div className="flex-1/3">
              <img alt="PAUL" src={logomark} className="ml-auto h-8 w-auto" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            {endpoints.is_ngohub_auth_enabled && (
              <Button asChild variant="outline">
                <Link href={`${endpoints.ngohub_url}${next_url ? "?next=" + encodeURIComponent(next_url) : ""}`}>
                  {t("loginChoice.loginWithNgoHub")}
                </Link>
              </Button>
            )}

            {endpoints.is_ngohub_auth_enabled && endpoints.is_email_auth_enabled && (
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">{t("loginChoice.or")}</span>
              </div>
            )}

            {endpoints.is_email_auth_enabled && (
              <Button asChild variant="default">
                <Link href={`${endpoints.email_url}?next=${next_url}`}>{t("loginChoice.loginWithEmail")}</Link>
              </Button>
            )}
          </div>
          <LoginRegisterCta />
        </CardContent>
      </Card>
    </div>
  );
}
