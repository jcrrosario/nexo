'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type MeResponse = {
  tenant: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    async function loadMe() {
      try {
        const response = await fetch('http://localhost:3001/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Não autorizado');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-900">
            Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Sair
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Tenant</p>
            <p className="text-lg font-medium">{data.tenant}</p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Email</p>
            <p className="text-lg font-medium">{data.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
