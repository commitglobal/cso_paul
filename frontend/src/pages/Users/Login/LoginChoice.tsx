import { useValidatedProps } from '@/hooks/useValidatedProps';
import { LoginChoiceForm } from "@/components/paul/login-choice-form"
import { LoginChoiceProps } from './LoginChoiceProps';



export default function LoginChoice() {
  const {
    props: { endpoints },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="bg-muted flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3/4">
            <LoginChoiceForm endpoints={endpoints} />
          </div>
        </div>
      </div>
    </div>
  )
}