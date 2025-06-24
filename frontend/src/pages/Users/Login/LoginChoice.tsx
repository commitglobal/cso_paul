import { useValidatedProps } from '@/hooks/useValidatedProps';
import { LoginChoiceForm } from "@/components/paul/login-choice-form"
import { LoginChoiceProps } from './LoginChoiceProps';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"



export default function LoginChoice() {
  const {
    props: { endpoints },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3/4">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Welcome back to PAUL</h1>
                </div>
              </CardHeader>
              <CardContent>
                Login to manage our NGO's data in one place, from
                beneficiaries and donors to events and reports.
              </CardContent>
          </Card>
        </div>
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