'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={` ${
        isActive
          ? 'text-blue-600 hover:underline'
          : 'text-gray-700 hover:underline'
      }`}
    >
      {children}
    </Link>
  );
}
