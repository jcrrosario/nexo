'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import RiskChart from './components/RiskChart';

type MeResponse = {
  tenant: string;
  email: string;
};

type Team = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(3);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        const meRes = await fetch('http://localhost:3001/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) throw new Error();
        setMe(await meRes.json());

        const teamRes = await fetch('http://localhost:3001/team', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!teamRes.ok) throw new Error();
        setTeams(await teamRes.json());
      } catch {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router, token]);

  async function createTeam() {
    if (!newTeam.trim()) return;

    await fetch('http://localhost:3001/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newTeam }),
    });

    setNewTeam('');

    const res = await fetch('http://localhost:3001/team', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTeams(await res.json());
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-2xl font-semibold text-blue-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Visão geral do seu tenant
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Diagnósticos" value={173} subtitle="ativos" variant="success" />
        <StatCard title="Times em risco" value={3} subtitle="alto" variant="danger" />
        <StatCard title="Ações preventivas" value={5} subtitle="acompanhadas" variant="warning" />
        <StatCard title="Compliance NR-1" value="Em dia" variant="success" />
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-900">
            Mapa de Risco Psicossocial
          </h2>

          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <RiskChart months={months} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Tenant</p>
          <p className="text-2xl font-semibold text-blue-900 mt-1">
            {me.tenant}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500">Usuário</p>
          <p className="text-lg font-medium text-gray-800 mt-1">
            {me.email}
          </p>
        </div>
      </div>
    </div>
  );
}
