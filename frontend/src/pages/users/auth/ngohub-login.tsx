import ngohubLogo from "@/assets/ngohub-logo.svg";
import { Button } from "@/components/ui/button";
import { useValidatedProps } from "@/hooks/use-validated-props";
import BlankLayout from "@/layouts/blank-layout";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NgohubLoginProps } from "./ngohub-login-props";

export default function NgohubLogin() {
  const { t } = useTranslation();

  const {
    props: { redirect_endpoint, provider, process, callback_url, csrf_token },
  } = useValidatedProps<NgohubLoginProps>(NgohubLoginProps);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-3/4 text-center">
          <h1 className="text-2xl font-bold">{t("login.ngohub.redirecting.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("login.ngohub.redirecting.desc")}</p>

          <form ref={formRef} method="post" action={redirect_endpoint} className="hidden" aria-hidden>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token} />
            <input type="hidden" name="provider" value={provider} />
            <input type="hidden" name="process" value={process} />
            <input type="hidden" name="callback_url" value={callback_url} />
          </form>

          {showFallback && (
            <div className="mt-6">
              <Button variant="secondary" size="lg" onClick={() => formRef.current?.submit()}>
                {t("login.ngohub.redirecting.manual")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-muted flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3/4">
            <img alt="NGO Hub logo" src={ngohubLogo} className="w-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

NgohubLogin.layout = BlankLayout;
