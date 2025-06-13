'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth.service';
import { httpService } from '@/app/services/http.service';
import { UserDto } from '@/app/types/api.types';

interface Role {
  id: number;
  name: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentUsername = authService.getUsername();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const [userResponse, rolesResponse] = await Promise.all([
          httpService.get<UserDto>(`/User/${params.id}`),
          httpService.get<Role[]>('/Role')
        ]);
        setUser(userResponse.data);
        setRoles(rolesResponse.data);
        
        // Check if trying to edit current user
        if (userResponse.data.username === currentUsername) {
          setError('You cannot edit your own account');
          router.push('/admin/users');
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('403')) {
          setError('You do not have permission to edit users');
        } else {
          setError('Failed to load user');
        }
        console.error('User fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isLoggedIn() && authService.isAdmin()) {
      fetchUser();
    } else {
      router.push('/');
    }
  }, [params.id, router, currentUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await httpService.put(`/User/${params.id}`, {
        username: user.username,
        email: user.email,
        roles: user.roles
      });
      router.push('/admin/users');
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        setError('You do not have permission to edit users');
      } else {
        setError('Failed to update user');
      }
      console.error('Update user error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Edit User</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Roles</label>
                <div className="mt-2 space-y-2">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={role.name}
                        checked={user.roles.includes(role.name)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...user.roles, role.name]
                            : user.roles.filter((r) => r !== role.name);
                          setUser({ ...user, roles: newRoles });
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={role.name} className="ml-2 block text-sm text-gray-900">
                        {role.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin/users')}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 