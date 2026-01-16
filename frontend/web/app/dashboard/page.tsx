'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import StatCard from '@/components/StatCard';
import RiskChart from '@/app/dashboard/components/RiskChart';
import RiskSummary from '@/app/dashboard/components/RiskSummary';

type MeResponse = {
  tenant: string;
  email: string;
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
  const [loading, setLoading] = useState(true);

  const [months, setMonths] = useState(3);
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

    async function load() {
      try {
        const res = await fetch(
          'http://localhost:3001/auth/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data: MeResponse = await res.json();

        localStorage.setItem('tenant', data.tenant);
        setMe(data);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('tenant');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router, token]);

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

      {/* Cards */}
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

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-blue-900">
            Mapa de Risco Psicossocial
          </h2>

          <select
            value={months}
            onChange={(e) =>
              setMonths(Number(e.target.value))
            }
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <RiskChart
            months={months}
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
    </div>
  );
}
