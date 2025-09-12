'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import Link from 'next/link';

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">👤 User Profile</h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">
              {session.user?.name || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{session.user?.email}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
