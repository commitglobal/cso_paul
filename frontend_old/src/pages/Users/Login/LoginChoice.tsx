import { useValidatedProps } from '@/hooks/useValidatedProps';
import { InternalLink } from '@/components/InternalLink';
import { LinkButton } from '@/components/LinkButton';
import { LoginChoiceProps } from './LoginChoiceProps';
import LoginLayout from '@/layouts/LoginLayout';


export default function LoginChoice() {
  const {
    props: { endpoints },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <div className='flex flex-col gap-y-8 items-center m-10'>
      <div className='font-bold text-[24px] text-black w-full'>
        Login to PAUL
      </div>
      {endpoints.ngohub && (
        <div className='w-full'><LinkButton to={endpoints.ngohub_url} fullWidth={true}>Login with NGO Hub</LinkButton></div>
      )}
      {endpoints.email && (
        <div className='w-full'><LinkButton to={endpoints.email_url} fullWidth={true}>Login with email</LinkButton></div>
      )}
      <div className='flex gap-x-2 justify-center w-full text-center text-[16px]'>
        <div>New here?</div>
        <div><InternalLink name='Register your organization' color='text-paul-600' fontSize='text-[16px]' to='/to-do/' /></div>
      </div>
    </div>
  );
}

LoginChoice.layout = LoginLayout;
