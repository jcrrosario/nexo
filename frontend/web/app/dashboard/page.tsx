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
        const meData = await meRes.json();
        setMe(meData);

        const teamRes = await fetch('http://localhost:3001/team', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!teamRes.ok) throw new Error();
        const teamData = await teamRes.json();
        setTeams(teamData);
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

    const data = await res.json();
    setTeams(data);
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

      {/* Título */}
      <div>
        <h1 className="text-2xl font-semibold text-blue-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Visão geral do seu tenant
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Diagnósticos"
          value={173}
          subtitle="ativos"
          variant="success"
        />

        <StatCard
          title="Times em risco"
          value={3}
          subtitle="alto"
          variant="danger"
        />

        <StatCard
          title="Ações preventivas"
          value={5}
          subtitle="acompanhadas"
          variant="warning"
        />

        <StatCard
          title="Compliance NR-1"
          value="Em dia"
          variant="success"
        />
      </div>

      {/* Gráfico principal */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-900">
            Mapa de Risco Psicossocial
          </h2>

          <select className="border rounded-md px-3 py-1 text-sm">
            <option>3 meses</option>
            <option>6 meses</option>
            <option>12 meses</option>
          </select>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <RiskChart />
        </div>

        <div className="flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Baixo
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            Médio
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Alto
          </div>
        </div>
      </div>

      {/* Informações do tenant */}
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

      {/* Times */}
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-blue-900">
          Times
        </h2>

        <div className="flex gap-2">
          <input
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Nome do time"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={createTeam}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Criar
          </button>
        </div>

        {teams.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhum time cadastrado ainda
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teams.map((team) => (
              <li
                key={team.id}
                className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                {team.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
