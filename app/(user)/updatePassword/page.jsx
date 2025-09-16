'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-toastify';
import LoadingBtn from '@/components/LoadingBtn';

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const router = useRouter();
  const { updateUserPassword, error, isLoading } = useUserStore();

  const handleUpdate = async e => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both Fields are required');
      return;
    }
    try {
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Password Updated Successfully.');
      router.back();
    } catch (err) {
      console.error('Profile save error:', err);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <ArrowLeft
            size={20}
            className="cursor-pointer"
            onClick={() => router.back()}
          >
            Go Back
          </ArrowLeft>
          <CardTitle>Update your password here</CardTitle>
          <CardDescription>
            Enter your current and new password below to update
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdate}>
            <div className="flex flex-col gap-6">
              {/* Current Password */}
              <div className="grid gap-2 relative">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Current password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
              </div>

              {/* New Password */}
              <div className="grid gap-2 relative">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              {/* Toggle Button (controls both fields) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1 text-sm text-gray-500 self-end"
              >
                {showPassword ? (
                  <>
                    <EyeOff size={16} /> Hide Passwords
                  </>
                ) : (
                  <>
                    <Eye size={16} /> Show Passwords
                  </>
                )}
              </button>
            </div>
            {!isLoading ? (
              <Button type="submit" className="w-full mt-3">
                Update
              </Button>
            ) : (
              <LoadingBtn />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;
