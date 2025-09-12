'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import LoadingBtn from '@/components/LoadingBtn';
import { useUserStore } from '@/store/useUserStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { loginUser, isLoading, error } = useUserStore();

  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill fields');
      return;
    }

    try {
      const result = await loginUser(email, password);

      if (result === null) {
        toast.error(error);
        setEmail('');
        setPassword('');
      } else {
        toast.success('Login successful.');
        router.push('/');
      }
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen ">
        <div className="shadow-md border w-2xs gap-3 border-gray-600 rounded p-4 flex flex-col items-center bg-white">
          <h1 className="font-semibold  text-black ">
            User | <span className="text-blue-500">Login</span>
          </h1>
          <form className="flex flex-col w-full gap-3" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter Email"
                type={'text'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Password"
                type={'password'}
              />
            </div>
            <div>
              {!isLoading ? (
                <Button type="submit">Login</Button>
              ) : (
                <LoadingBtn />
              )}
            </div>
            <p className="">
              Don't have an account?{' '}
              <Link
                href={'/register'}
                className="hover:underline text-blue-500"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
