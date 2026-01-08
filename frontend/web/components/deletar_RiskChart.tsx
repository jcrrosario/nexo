'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const data = [
  { month: 'Mar', baixo: 10, medio: 3, alto: 2 },
  { month: 'Abr', baixo: 18, medio: 6, alto: 4 },
  { month: 'Mai', baixo: 12, medio: 9, alto: 8 },
];

export default function RiskChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900">
          Mapa de Risco Psicossocial
        </h3>

        <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
          <option>3 meses</option>
          <option>6 meses</option>
          <option>12 meses</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="baixo"
              stroke="#22c55e"
              strokeWidth={3}
              name="Baixo"
            />

            <Line
              type="monotone"
              dataKey="medio"
              stroke="#facc15"
              strokeWidth={3}
              name="Médio"
            />

            <Line
              type="monotone"
              dataKey="alto"
              stroke="#ef4444"
              strokeWidth={3}
              name="Alto"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
