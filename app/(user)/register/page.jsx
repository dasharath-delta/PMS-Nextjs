'use client';
import Loading from '@/components/Loading';
import LoadingBtn from '@/components/LoadingBtn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clearFields = () => {
    setEmail('');
    setUserName('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleRegister = async e => {
    e.preventDefault();

    if (!email || !password || !username || !confirmPassword) {
      toast.error('Please fill all the fields');
      return;
    } else if (password !== confirmPassword) {
      toast.error('Password not match.');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        '/api/auth/register',
        { username, email, password },
        { withCredentials: true }
      );

      if (data.success == true) {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      clearFields();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="shadow-md border w-2xs gap-3 border-gray-600 rounded p-4 flex flex-col items-center bg-white">
          <h1 className="font-semibold  text-black ">
            User | <span className="text-blue-500">Register</span>
          </h1>
          <form
            className="flex flex-col w-full gap-3"
            onSubmit={handleRegister}
          >
            <div className="flex flex-col gap-2">
              <Label>User Name</Label>
              <Input
                value={username}
                onChange={e => setUserName(e.target.value)}
                className="capitalize"
                placeholder="Ex. @example123"
                type={'text'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ex. user12@example.com"
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
            <div className="flex flex-col gap-2">
              <Label>Confirm Password</Label>
              <Input
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type={'password'}
              />
            </div>
            <div>
              {!isLoading ? (
                <Button type="submit">Register</Button>
              ) : (
                <LoadingBtn />
              )}
            </div>
            <p className="">
              Already have an account?{' '}
              <Link href={'/login'} className="hover:underline text-blue-500">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
