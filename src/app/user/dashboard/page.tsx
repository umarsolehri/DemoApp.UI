'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { httpService } from '../../services/http.service';
import { DashboardResponse } from '../../types/api.types';

export default function UserDashboardPage() {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{dashboardData?.message || 'User Dashboard'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {authService.getUsername()}
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
            <h2 className="text-lg font-medium mb-4">User Dashboard</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Welcome to your dashboard. Here you can view your profile and access user features.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/user/profile')}
                  className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">My Profile</h3>
                  <p className="text-sm text-gray-500">View and edit your profile information</p>
                </button>
                <button
                  onClick={() => router.push('/user/settings')}
                  className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-500">Manage your account settings</p>
                </button>
                <button
                  onClick={() => router.push('/user/activity')}
                  className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">Activity</h3>
                  <p className="text-sm text-gray-500">View your recent activity</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 