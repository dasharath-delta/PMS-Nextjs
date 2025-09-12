'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { useUserStore } from '@/store/useUserStore';
import LoadingBtn from './LoadingBtn';
import NavLink from './NavLink';

const Navbar = () => {
  const { logoutUser, isLoading, error } = useUserStore();
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-secondary bg-white relative transition-all shadow-md">
      <Link href={'/'} className="font-semibold text-2xl text-blue-500">
        PMS
      </Link>
      <div className="capitalize font-medium text-gray-800 flex items-center gap-3">
        <NavLink href={'/'}>home</NavLink>
        {session && <NavLink href={'/products'}>products</NavLink>}
        <NavLink href={'/contact'}>contact</NavLink>
      </div>
      <div>
        {!session ? (
          <div className="flex gap-2">
            <Link
              className="bg-black rounded-md text-white font-semibold py-2 px-4 text-sm"
              href={'/login'}
            >
              Login
            </Link>
            <Link
              className="bg-black rounded-md text-white font-semibold py-2 px-4 text-sm"
              href={'/register'}
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex gap-2 items-center ">
            <Link
              href={'/profile'}
              className="font-semibold border py-1.5 px-4 text-sm rounded hover:bg-black hover:text-white cursor-pointer duration-200"
            >
              Profile
            </Link>
            {!isLoading ? (
              <Button onClick={() => logoutUser()}>Logout</Button>
            ) : (
              <LoadingBtn />
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
