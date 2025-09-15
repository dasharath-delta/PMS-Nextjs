'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Users = () => {
  const { allUsers, fetchAllUsers, isLoading, error } = useUserStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!allUsers || allUsers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        No users found
      </div>
    );
  }

  // Group users by role
  const groupedUsers = allUsers.reduce((acc, user) => {
    acc[user.role] = acc[user.role] || [];
    acc[user.role].push(user);
    return acc;
  }, {});

  // Filter function
  const filterUsers = users => {
    return users.filter(
      user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">All Users</h1>

      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 mb-6 max-w-md mx-auto">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by username or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue={Object.keys(groupedUsers)[0]} className="w-full">
        <TabsList className="flex justify-center mb-6">
          {Object.keys(groupedUsers).map(role => (
            <TabsTrigger key={role} value={role} className="capitalize">
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedUsers).map(([role, users]) => (
          <TabsContent key={role} value={role}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filterUsers(users).length > 0 ? (
                filterUsers(users).map(user => (
                  <Card
                    key={user.id}
                    className="shadow-md border border-gray-200 rounded-2xl"
                  >
                    <CardHeader className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="capitalize">
                        {user.username}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Email: </span>
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Role: </span>
                        {user.role}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Joined: </span>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  No matching users found.
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
};

export default Users;
