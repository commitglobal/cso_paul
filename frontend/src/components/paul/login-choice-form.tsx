import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginChoiceProps } from '@/pages/users/auth/login-choice-props';
import { Link } from '@inertiajs/react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import logomark from '@/assets/paul-logomark.svg';
import { LoginRegisterCta } from '@/components/paul/login-register-cta.tsx'


export function LoginChoiceForm({
  endpoints,
  next_url,
}: LoginChoiceProps) {
  return (
    <div className={cn('flex flex-col gap-6')}>
      <Card>

        <CardHeader>
          <div className="flex flex-row gap-2">
            <div className="flex-2/3"><h1 className="text-2xl font-bold">Login to PAUL</h1></div>
            <div className="flex-1/3"><img alt="PAUL" src={logomark} className="ml-auto h-8 w-auto" /></div>
          </div>
        </CardHeader>

        <CardContent>
          <div className='grid gap-6'>
            {endpoints.ngohub && (
              <Button asChild variant='outline'>
                <Link href={`${endpoints.ngohub_url}?next=${next_url}`}>Login with NGO Hub</Link>
              </Button>
            )}

            {endpoints.email && endpoints.ngohub && (
              <div
                className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                <span className='bg-background text-muted-foreground relative z-10 px-2'>
                    OR
                </span>
              </div>
            )}

            {endpoints.email && (
              <Button asChild variant='default'>
                <Link href={`${endpoints.email_url}?next=${next_url}`}>Login with email</Link>
              </Button>
            )}
          </div>
          <LoginRegisterCta />
        </CardContent>
      </Card>
    </div>
  )
}
