'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import LoadingBtn from '@/components/LoadingBtn';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const Register = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clearFields = () => {
    setUserName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('user');
    setAdminSecret('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !role) {
      toast.error('Please fill all the fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (role === 'admin' && !adminSecret) {
      toast.error('Admin secret key is required');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        '/api/auth/register',
        { username, email, password, role, adminSecret },
        { withCredentials: true }
      );
      
      if (data.success) {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      clearFields();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-[350px] shadow-md">
        <CardHeader>
          <CardTitle className="text-center">
            User <span className="text-blue-500">Register</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex. @example123"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. user12@example.com"
                type="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'admin' && (
              <div className="flex flex-col gap-2">
                <Label>Admin Secret Key</Label>
                <Input
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter Admin Secret"
                  type="password"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                type="password"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Confirm Password</Label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
              />
            </div>

            {!isLoading ? (
              <Button type="submit" className="w-full">
                Register
              </Button>
            ) : (
              <LoadingBtn />
            )}
          </form>
        </CardContent>

        <CardFooter className="text-sm text-center flex justify-center">
          Already have an account?{' '}
          <Link href="/login" className="ml-1 text-blue-500 hover:underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
