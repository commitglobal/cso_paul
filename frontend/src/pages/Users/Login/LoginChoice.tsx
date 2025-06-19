import { useValidatedProps } from '@/hooks/useValidatedProps';
import { InternalLink } from '@/components/InternalLink';
import { LinkButton } from '@/components/LinkButton';
import { LoginChoiceProps } from './LoginChoiceProps';



export default function LoginChoice() {
  const {
    props: { endpoints },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <>
      <div className='flex flex-col gap-y-24 max-w-7xl mx-auto pt-12 lg:pt-32 px-4'>
        <h1 className='font-bold text-4xl text-black mb-6'>
          Login to PAUL
        </h1>
        {endpoints.ngohub && (
          <LinkButton to={endpoints.ngohub_url}>Login with NGO Hub</LinkButton>
        )}
        {endpoints.email && (
          <LinkButton to={endpoints.email_url}>Login with email</LinkButton>
        )}
        <InternalLink name='Register your organization' to='/to-do/' />
      </div>
    </>
  );
}

// LoginChoice.layout = LayoutDefault;
