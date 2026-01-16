'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import RiskChart from '@/app/dashboard/components/RiskChart';
import RiskSummary from '@/app/dashboard/components/RiskSummary';
import { Building2, User } from 'lucide-react';

type MeResponse = {
  tenant: string;
  email: string;
};

type Team = {
  id: string;
  name: string;
};

type RiskMapResponse = {
  labels: string[];
  baixo: number[];
  medio: number[];
  alto: number[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [loading, setLoading] = useState(true);

  const [months, setMonths] = useState(12);
  const [selectedTeamId, setSelectedTeamId] =
    useState<string | null>(null);

  const [riskRawData, setRiskRawData] =
    useState<RiskMapResponse | null>(null);

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

      {/* Cabeçalho refinado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Visão geral do ambiente
          </p>
        </div>

        {/* Contexto: tenant e usuário */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-full text-sm">
            <Building2 size={16} />
            <span>{me.tenant}</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
            <User size={16} />
            <span>{me.email}</span>
          </div>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Diagnósticos" value={173} subtitle="ativos" variant="success" />
        <StatCard title="Times em risco" value={3} subtitle="alto" variant="danger" />
        <StatCard title="Ações preventivas" value={5} subtitle="acompanhadas" variant="warning" />
        <StatCard title="Compliance NR-1" value="Em dia" variant="success" />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-blue-900">
            Mapa de Risco Psicossocial
          </h2>

          <div className="flex gap-3">
            <select
              value={selectedTeamId ?? ''}
              onChange={(e) =>
                setSelectedTeamId(
                  e.target.value || null
                )
              }
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="">Todos os times</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

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
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <RiskChart
            months={months}
            teamId={selectedTeamId}
            onDataLoaded={setRiskRawData}
          />
        </div>

        {riskRawData && (
          <RiskSummary
            labels={riskRawData.labels}
            alto={riskRawData.alto}
          />
        )}
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
