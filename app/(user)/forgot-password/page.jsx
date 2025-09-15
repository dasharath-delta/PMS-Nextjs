'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useUserStore } from '@/store/useUserStore';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { forgotPassword, isLoading } = useUserStore();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const msg = await forgotPassword(email);
      toast.success(msg || 'Reset link sent to your email.');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
