'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
        // auth/me
        const meRes = await fetch('http://localhost:3001/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) throw new Error();

        const meData = await meRes.json();
        setMe(meData);

        // team
        const teamRes = await fetch('http://localhost:3001/team', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!teamRes.ok) throw new Error();

        const teamData = await teamRes.json();
        setTeams(teamData);
      } catch (err) {
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
      body: JSON.stringify({
        name: newTeam,
      }),
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

  if (!me) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
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

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Tenant</p>
            <p className="text-lg font-medium">{me.tenant}</p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-700">Email</p>
            <p className="text-lg font-medium">{me.email}</p>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Times
          </h2>

          <div className="flex gap-2">
            <input
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="Nome do time"
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              onClick={createTeam}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Criar
            </button>
          </div>

          {teams.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum time cadastrado ainda
            </p>
          )}

          <ul className="space-y-2">
            {teams.map((team) => (
              <li
                key={team.id}
                className="p-3 bg-gray-50 border rounded"
              >
                {team.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
