import { useForm, usePage } from '@inertiajs/react';
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
  const { data, setData, post, processing } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      post(apiPostUrls.userLogin, {
        preserveScroll: true,
      });
    },
    [post],
  );

  const formErrors = errors?.login;

  return (
    <>
      <form className='flex flex-col gap-y-6' onSubmit={handleSubmit}>
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
            color='text-purple-600'
            fontSize='text-sm'
            name='Forot your password?'
            to={`/to-do/`}
            underline={false}
          />
        </div>
        <Button disabled={processing}>Login</Button>
      </form>
    </>
  );
}
