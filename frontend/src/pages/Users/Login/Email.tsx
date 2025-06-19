import { LoginForm } from '@/components/LoginForm';
import LoginLayout from '@/layouts/LoginLayout';


export default function Index() {
  return (
    <div className='flex flex-col gap-y-8 items-center'>
      <h1 className='font-bold text-xl text-black mb-6'>
        Login to PAUL
      </h1>
      
      <LoginForm />
    </div>
  );
}

Index.layout = LoginLayout;
