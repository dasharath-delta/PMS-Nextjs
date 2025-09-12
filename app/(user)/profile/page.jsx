'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import Link from 'next/link';
import ProfileForm from '@/components/ProfileForm';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-toastify';

const Profile = () => {
  const { data: session, status } = useSession();
  const { profile, fetchProfile, isEdit, setIsEdit, isLoading, updateUsername, user, fetchCurrentUser } = useUserStore();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(session?.user?.name || '');


  // Fetch profile when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
      setUsernameInput(user?.name);
      fetchCurrentUser()
    }
  }, [session?.user?.id, fetchProfile, user?.name]);

  const handleUsernameSave = async () => {
    if (!usernameInput) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      await updateUsername(usernameInput); // call store function
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Not logged in</h1>
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 w-full text-gray-800 p-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          My<span className="text-blue-500 border-l-2 ml-1.5 pl-1.5">Profile</span>
        </h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex  flex-col ">
            <p className="text-sm text-gray-500">User Name</p>
            {!isEditingUsername ? (
              <div className='flex items-center justify-between'>
                <p className="text-lg font-medium">{user?.username || 'Not provided'}</p>
                <Button size="sm" variant="outline" onClick={() => setIsEditingUsername(true)}>
                  Edit
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-center ">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  className="border rounded px-2 py-1 text-lg"
                />
                <Button size="sm" onClick={handleUsernameSave}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingUsername(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{session.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Password</p>
            <div className='flex items-center'>
              <input disabled type='password' value={1234567890} onChange={() => { return }} className="text-lg font-medium" />
              <Link href={"/updatePassword"} className='hover:underline font-semibold'>Update Pasaword</Link>
            </div>
          </div>

          {/* Extra Info */}
          {profile && (
            <>
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="text-lg font-medium">{profile.firstname || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="text-lg font-medium">{profile.lastname || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-lg font-medium capitalize">{profile.bio || '—'}</p>
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
                <p className="text-lg font-medium capitalize">{profile.location || '—'}</p>
              </div>
            </>
          )}
        </div>

        {/* Buttons */}
        {!isEdit && (
          <Button onClick={() => setIsEdit(true)} className="mt-8 w-full">
            {profile ? "Edit Profile" : "Set Profile"}
          </Button>
        )}
      </div>

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
