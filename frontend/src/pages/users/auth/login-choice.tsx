import { useValidatedProps } from '@/hooks/use-validated-props';
import { LoginChoiceForm } from "@/components/paul/login-choice-form";
import { LoginText } from "@/components/paul/login-text";
import { LoginChoiceProps } from './login-choice-props';
import BlankLayout from '@/layouts/blank-layout';
import i18n from "i18next";
import { useEffect } from "react";


export default function LoginChoice() {
  const {
    props: {endpoints, next_url, language},
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  useEffect(() => {
    console.log('Language changed to:', language);
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-3/4">
          <LoginText/>
        </div>
      </div>
      <div className="bg-muted flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3/4">
            <LoginChoiceForm endpoints={endpoints} next_url={next_url}/>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginChoice.layout = BlankLayout;
