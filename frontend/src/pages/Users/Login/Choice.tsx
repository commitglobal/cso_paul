import { useValidatedProps } from '@/hooks/useValidatedProps';
import LayoutDefault from '@/layouts/LayoutDefault';
import { InternalLink } from '@/components/InternalLink';
import { LoginChoiceProps } from './LoginChoiceProps';



export default function Choice() {
  const {
    props: { endpoints },
  } = useValidatedProps<LoginChoiceProps>(LoginChoiceProps);

  return (
    <>
      <div className='flex flex-col gap-y-24 max-w-7xl mx-auto pt-12 lg:pt-32 px-4'>
        <h1 className='font-bold text-4xl text-black mb-6'>
          Login
        </h1>
        {endpoints.email && (
          <InternalLink name='Log in by email' to={endpoints.email_url} />
        )}
        {endpoints.ngohub && (
          <InternalLink name='Log in by NGO Hub' to={endpoints.ngohub_url} />
        )}
      </div>

    </>
  );
}

Choice.layout = LayoutDefault;
