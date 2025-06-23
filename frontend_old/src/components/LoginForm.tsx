import { router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useCallback } from 'react';
import { apiPostUrls } from '@/constants/apiUrls';
import { handleChange } from '@/utils/handleChange';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { InputField } from './InputField';
import { InternalLink } from './InternalLink';


type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};


export function LoginForm() {
  const {
    props: { errors },
  } = usePage();
  const { data, setData, processing } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      router.post(
        apiPostUrls.userEmailLogin, 
        { ...data},
        {preserveScroll: true,}
      );
    },
    [data],
  );

  const formErrors = errors?.login;

  return (
    <form className='flex flex-col gap-y-6 w-full' onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 gap-y-6 gap-x-10 w-full'>
        <InputField
          errors={formErrors?.email}
          label='Email address'
          name='email'
          onChange={handleChange<LoginFormData>('email', setData)}
          value={data.email}
        />

        <InputField
          errors={formErrors?.password}
          label='Password'
          name='password'
          onChange={handleChange<LoginFormData>('password', setData)}
          type='password'
          value={data.password}
        />

        <div className='flex justify-between'>
          <Checkbox
            checked={data.remember}
            label='Remember me'
            name='remember'
            onChange={(e) => setData('remember', e.target.checked)}
          />

          <InternalLink
            color='text-paul-600'
            fontSize='text-sm'
            name='Forgot password?'
            to={`/to-do/`}
          />
        </div>
        <div className='w-full text-center center'>
          <Button disabled={processing}>Login</Button>
        </div>
        <div className='w-full text-center text-[16px]'>
          New here?
          <InternalLink name='Register your organization' color='text-paul-600' fontSize='text-[16px]' to='/to-do/' />
        </div>
      </div>
    </form>
  );
}
