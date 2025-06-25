import { router, useForm, Link, usePage } from '@inertiajs/react';
import { type FormEventHandler, useCallback } from 'react';
import { apiPostUrls } from '@/constants/api-urls';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleChange } from '@/utils/handle-change';
import { LoginChoiceProps } from '@/pages/users/auth/login-choice-props';
import logomark from '@/assets/paul-logomark.svg';
import { useTranslation } from 'react-i18next'


type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
  next: string | undefined;
};


export function LoginForm({
    next_url,
  }: LoginChoiceProps) {
  const {
    props: { errors },
   } = usePage();

  const { t } = useTranslation();
  const { data, setData, processing } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
    next: next_url,
  });
  console.log(next_url)

  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault()
      router.post(
        apiPostUrls.userEmailLogin,
        { ...data },
        { preserveScroll: true }
      )
    },
    [data]
  )

  return (
    <div className='flex flex-col gap-6'>
      <Card>

        <CardHeader>
          <div className="flex flex-row gap-2">
            <div className="flex-2/3"><h1 className='text-2xl font-bold'>Login to PAUL</h1></div>
            <div className="flex-1/3"><img alt="PAUL" src={logomark} className="ml-auto h-8 w-auto" /></div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  placeholder=''
                  required
                  onChange={handleChange<LoginFormData>('email', setData)}
                  aria-invalid={errors?.login?.email ? "true" : "false"}
                  aria-describedby={errors?.login?.email ? "email_errors" : ""}
                  className={errors?.login?.email && "border-destructive"}
                  value={data.email}
                />
                {errors?.login?.email && <p id="email_errors" className='text-destructive text-sm'>{errors.login.email}</p>}
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  onChange={handleChange<LoginFormData>("password", setData)}
                  aria-invalid={errors?.login?.password ? "true" : "false"}
                  aria-describedby={errors?.login?.password ? "password_errors" : ""}
                  className={errors?.login?.password && "aria-invalid:border-destructive"}
                  value={data.password}
                />
                {errors?.login?.password && <p id="password_errors" className='text-destructive text-sm'>{errors.login.password}</p>}

                <Input
                  id="next"
                  type="hidden"
                  name="next"
                  placeholder=""
                  value={next_url}
                /><Link
                  href='#'
                  className='ml-auto inline-block text-sm underline-offset-4 underline'
                >
                  Forgot your password?
                </Link>
              </div>
              <Button type='submit' disabled={processing} className='w-full'>
                Login
              </Button>
            </div>
            <div className='flex text-center text-sm mt-6 gap-2 justify-center'>
              {t('newHere')}
              <Link href='#' className='underline underline-offset-4'>
                Register your organization
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
