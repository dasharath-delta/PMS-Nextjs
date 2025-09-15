'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { useUserStore } from '@/store/useUserStore';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const { resetPassword, isLoading } = useUserStore();

  useEffect(() => {
    if (!token) {
      toast.error('No reset token found');
      router.push('/forgot-password');
    }
  }, [token, router]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const msg = await resetPassword(token, newPassword);
      toast.success(msg || 'Password updated successfully.');
      router.push('/login');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
