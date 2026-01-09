'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type RiskMapResponse = {
  labels: string[];
  baixo: number[];
  medio: number[];
  alto: number[];
};

type Props = {
  months: number;
};

export default function RiskChart({ months }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  useEffect(() => {
    if (!token) return;

    async function loadChart() {
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:3001/diagnostic/risk-map?months=${months}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json: RiskMapResponse = await res.json();

        const chartData = json.labels.map((label, index) => ({
          name: label,
          baixo: json.baixo[index],
          medio: json.medio[index],
          alto: json.alto[index],
        }));

        setData(chartData);
      } catch (err) {
        console.error('Erro ao carregar gráfico', err);
      } finally {
        setLoading(false);
      }
    }

    loadChart();
  }, [months, token]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        Carregando gráfico...
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="baixo"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="medio"
            stroke="#facc15"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="alto"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
