import { router, useForm, Link } from '@inertiajs/react';
import { type FormEventHandler, useCallback } from 'react';
import { apiPostUrls } from '@/constants/apiUrls';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { handleChange } from '@/utils/handleChange';


type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};


export function LoginForm() {
  // const {
  //   props: { errors },
  // } = usePage();
  
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

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Login to PAUL</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder=""
                  required
                  onChange={handleChange<LoginFormData>('email', setData)}
                  value={data.email}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  onChange={handleChange<LoginFormData>('password', setData)}
                  value={data.password}
                />
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
              </div>
              <Button type="submit" disabled={processing} className="w-full">
                Login
              </Button>
            </div>
            <div className="text-center text-sm mt-6">
              New here?{" "}
              <Link href="#" className="underline underline-offset-4">
                Register your organization
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
