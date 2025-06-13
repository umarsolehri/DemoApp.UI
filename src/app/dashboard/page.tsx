'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { httpService } from '../services/http.service';
import { DashboardResponse } from '../types/api.types';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!authService.isLoggedIn()) {
        router.push('/');
        return;
      }

      try {
        setIsLoading(true);
        const response = await httpService.get<DashboardResponse>('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        if (error instanceof Error && error.message.includes('401')) {
          authService.logout();
          router.push('/');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const isAdmin = authService.isAdmin();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{dashboardData?.message || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {authService.getUsername()}
              </span>
              <span className="text-sm text-gray-600">
                Role: {dashboardData?.role || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Welcome to your Dashboard</h2>
            <p className="text-gray-600">
              {isAdmin 
                ? "You have access to administrative features and user management."
                : "You can view your profile and access user features."}
            </p>
          </div>

          {isAdmin && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Admin Controls</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Welcome to the admin dashboard. Here you can manage users and access administrative features.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => router.push('/admin/users')}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => router.push('/admin/settings')}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 