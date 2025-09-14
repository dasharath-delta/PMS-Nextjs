'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect non-admins away from dashboard
  useEffect(() => {
    if (session && session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, router]);

  if (!session || session.user.role !== 'admin') return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome Admin 👑</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center">
        This is the admin dashboard. Here you can manage users, reports, and
        other admin functionalities.
      </p>
    </main>
  );
}
