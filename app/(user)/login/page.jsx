'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import LoadingBtn from '@/components/LoadingBtn';
import { useUserStore } from '@/store/useUserStore';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { loginUser, isLoading, error } = useUserStore();

  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const user = await loginUser(email, password, role);

      if (!user) {
        toast.error(error || 'Invalid credentials');
        setEmail('');
        setPassword('');
      } else {
        toast.success('Login successful ✅');

        // 👇 Redirect based on role
        if (user.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch {
      toast.error(error || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">
            User <span className="text-blue-500">Login</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email"
                type="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password"
                type="password"
              />
            </div>

            <div className="flex items-center justify-between">
              {!isLoading ? (
                <Button type="submit" className="w-[120px]">
                  Login
                </Button>
              ) : (
                <LoadingBtn />
              )}
              <Link
                href="/forgot-password"
                className="text-sm text-red-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center flex justify-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="ml-1 text-blue-500 hover:underline">
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
