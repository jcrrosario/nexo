'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import StatCard from '@/components/StatCard';
import RiskChart from '@/app/dashboard/components/RiskChart';
import RiskSummary from '@/app/dashboard/components/RiskSummary';
import InsightCard from '@/components/ui/InsightCard';

import {
  ClipboardList,
  AlertTriangle,
  Activity,
  ShieldCheck,
} from 'lucide-react';

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
        const res = await fetch('http://localhost:3001/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <div className="space-y-12">

      {/* Cabeçalho */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-blue-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Leitura atual do ambiente
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Diagnósticos"
          value={173}
          subtitle="ativos"
          icon={<ClipboardList size={20} />}
        />

        <StatCard
          title="Times em risco"
          value={3}
          subtitle="alto"
          variant="danger"
          icon={<AlertTriangle size={20} />}
        />

        <StatCard
          title="Ações preventivas"
          value={5}
          subtitle="acompanhadas"
          variant="warning"
          icon={<Activity size={20} />}
        />

        <StatCard
          title="Compliance NR-1"
          value="Em dia"
          icon={<ShieldCheck size={20} />}
        />
      </div>

      {/* Gráfico + Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Gráfico */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Mapa de Risco Psicossocial
              </h2>
              <p className="text-sm text-gray-500">
                Evolução dos níveis de risco no período selecionado
              </p>
            </div>

            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
            >
              <option value={3}>Últimos 3 meses</option>
              <option value={6}>Últimos 6 meses</option>
              <option value={12}>Últimos 12 meses</option>
            </select>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-6">
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

        {/* Insight */}
        <InsightCard
          title="Situação atual"
          level="warning"
          description={
            <>
              Os dados indicam tendência de aumento de risco psicossocial
              nos últimos meses. Recomenda-se atenção especial aos times
              com maior concentração de risco alto.
            </>
          }
          actions={
            <div className="flex flex-col gap-2">
              <button className="text-sm font-medium text-blue-700 hover:underline">
                Ver times em risco
              </button>
              <button className="text-sm font-medium text-gray-700 hover:underline">
                Acompanhar ações
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
