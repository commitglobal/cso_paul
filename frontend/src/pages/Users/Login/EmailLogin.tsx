import { useValidatedProps } from '@/hooks/use-validated-props';
import { LoginText } from "@/components/paul/login-text"
import { LoginForm } from "@/components/paul/login-form"
import { LoginChoiceProps } from './LoginChoiceProps';


export default function EmailLogin() {
  const {
    props: { endpoints, next_url },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-3/4">
          <LoginText />
        </div>
      </div>
      <div className="bg-muted flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3/4">
            <LoginForm endpoints={endpoints} next_url={next_url} />
          </div>
        </div>
      </div>
    </div>
  )
}