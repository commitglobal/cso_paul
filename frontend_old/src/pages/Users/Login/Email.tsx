import { LoginForm } from '@/components/LoginForm';
import LoginLayout from '@/layouts/LoginLayout';


export default function Index() {
  return (
    <div className='flex flex-col gap-y-8 m-10'>
      <div className='font-bold text-[32px] text-black'>Login to PAUL</div>
      
      <LoginForm />
    </div>
  );
}

Index.layout = LoginLayout;
