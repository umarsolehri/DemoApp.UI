'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { httpService } from '../../services/http.service';
import { UserDto } from '../../types/api.types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentUsername = authService.getUsername();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await httpService.get<UserDto[]>('/User');
      setUsers(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        setError('You do not have permission to view users');
      } else {
        setError('Failed to load users');
      }
      console.error('Users fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isLoggedIn() && authService.isAdmin()) {
      fetchUsers();
    } else {
      router.push('/');
    }
  }, [router]);

  const handleDeleteUser = async (userId: number, username: string) => {
    if (username === currentUsername) {
      setError('You cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await httpService.delete(`/User/${userId}`);
      // Refresh the users list after successful deletion
      await fetchUsers();
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        setError('You do not have permission to delete users');
      } else {
        setError('Failed to delete user');
      }
      console.error('Delete user error:', error);
    }
  };

  const handleEditUser = (userId: number, username: string) => {
    if (username === currentUsername) {
      setError('You cannot edit your own account');
      return;
    }
    router.push(`/admin/users/${userId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Dashboard
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
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h2 className="text-lg font-medium">Users List</h2>
              <button
                onClick={() => router.push('/admin/users/create')}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New User
              </button>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username}
                        {user.username === currentUsername && (
                          <span className="ml-2 text-xs text-gray-500">(You)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.roles.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user.id, user.username)}
                          className={`text-indigo-600 hover:text-indigo-900 mr-4 ${
                            user.username === currentUsername ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={user.username === currentUsername}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className={`text-red-600 hover:text-red-900 ${
                            user.username === currentUsername ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={user.username === currentUsername}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 