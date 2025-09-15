'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-toastify';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const Profile = () => {
  const { data: session, status } = useSession();
  const {
    profile,
    fetchProfile,
    isEdit,
    setIsEdit,
    isLoading,
    updateUsername,
    user,
    fetchCurrentUser,
  } = useUserStore();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(session?.user?.name || '');

  // Fetch profile when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
      fetchCurrentUser();
    }
  }, [session?.user?.id, fetchProfile, fetchCurrentUser]);

  useEffect(() => {
    if (user?.username) {
      setUsernameInput(user.username);
    }
  }, [user?.username]);

  const handleUsernameSave = async () => {
    if (!usernameInput.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      await updateUsername(usernameInput);
      toast.success('Username updated successfully!');
      setIsEditingUsername(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update username');
    }
  };

  if (status === 'loading' || isLoading) {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-semibold">Not logged in</h1>
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 w-full text-gray-800 p-6">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Avatar className="w-20 h-20">
            {profile?.avatar ? (
              <AvatarImage
                src={profile.avatar}
                alt={profile?.username || 'User'}
              />
            ) : (
              <AvatarFallback>
                <User />
              </AvatarFallback>
            )}
          </Avatar>
          <h1 className="text-3xl font-bold text-center md:text-left">
            My
            <span className="text-blue-500 border-l-2 ml-1.5 pl-1.5">
              Profile
            </span>
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Username */}
          <div>
            <p className="text-sm text-gray-500">User Name</p>
            {!isEditingUsername ? (
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">
                  {user?.username || 'Not provided'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingUsername(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="text-lg"
                />
                <Button size="sm" onClick={handleUsernameSave}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingUsername(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{session.user?.email}</p>
          </div>

          {/* Password */}
          <div>
            <p className="text-sm text-gray-500">Password</p>
            <div className="flex items-center gap-2">
              <Input
                disabled
                type="password"
                value="*********"
                className="w-40"
              />
              <Link
                href="/updatePassword"
                className="underline hover:text-gray-500 font-semibold text-sm"
              >
                Update Password
              </Link>
            </div>
          </div>

          {/* Extra Info */}
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="text-lg font-medium">
                  {profile.firstname || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="text-lg font-medium">{profile.lastname || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-lg font-medium">{profile.bio || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">DOB</p>
                <p className="text-lg font-medium">{profile.dob || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-medium">{profile.phone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium">{profile.location || '—'}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          {!isEdit && (
            <Button onClick={() => setIsEdit(true)} className="mt-4 w-full">
              {profile ? 'Edit Profile' : 'Set Profile'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Edit Mode */}
      {isEdit && (
        <div className="mt-8 w-full max-w-2xl">
          <ProfileForm session={session} />
        </div>
      )}
    </main>
  );
};

export default Profile;
