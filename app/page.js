'use client';

import { useUserStore } from '@/store/useUserStore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const { fetchProfile } = useUserStore();
  const router = useRouter();

  // Fetch profile when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }

    // Redirect admin to dashboard
    if (session?.user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [session?.user?.id, session?.user?.role, fetchProfile, router]);

  // Don't show Home content to admin
  if (session?.user?.role === 'admin') return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our App 👋</h1>
      <p className="text-lg text-gray-600 max-w-xl text-center mb-6">
        This is the home page of your Next.js app. From here you can explore
        features, manage your profile, and navigate to different sections.
      </p>

      <div className="flex gap-4">
        {session ? (
          <Link
            href="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Go to Profile
          </Link>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          >
            Login
          </Link>
        )}
      </div>
    </main>
  );
}
