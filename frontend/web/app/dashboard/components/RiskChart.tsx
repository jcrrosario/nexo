'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { mes: 'Mar', baixo: 10, medio: 3, alto: 1 },
  { mes: 'Abr', baixo: 12, medio: 4, alto: 2 },
  { mes: 'Mai', baixo: 8, medio: 6, alto: 3 },
  { mes: 'Jun', baixo: 6, medio: 5, alto: 4 },
];

export default function RiskChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="baixo"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="medio"
            stroke="#facc15"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="alto"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
