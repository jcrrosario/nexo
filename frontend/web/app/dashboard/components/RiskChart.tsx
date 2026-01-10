'use client';

import { useEffect, useState } from 'react';

type RiskMapResponse = {
  labels: string[];
  baixo: number[];
  medio: number[];
  alto: number[];
};

type Props = {
  months: number;
  teamId?: string | null;
  onDataLoaded?: (data: RiskMapResponse) => void;
};

const LIMIT_HIGH_RISK = 8;

export default function RiskChart({
  months,
  teamId,
  onDataLoaded,
}: Props) {
  const [data, setData] = useState<RiskMapResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState({
    baixo: true,
    medio: true,
    alto: true,
  });

  useEffect(() => {
    let ignore = false;

    async function loadChart() {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        const params = new URLSearchParams({
          months: months.toString(),
        });

        if (teamId) {
          params.append('teamId', teamId);
        }

        const res = await fetch(
          `http://localhost:3001/diagnostic/risk-map?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json: RiskMapResponse = await res.json();
        if (ignore) return;

        setData(json);
        onDataLoaded?.(json);
      } catch (err) {
        console.error('Erro ao carregar gráfico', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadChart();
    return () => {
      ignore = true;
    };
  }, [months, teamId]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-[420px] text-sm text-gray-500">
        Carregando gráfico...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[420px] text-sm text-gray-500">
        Sem dados para exibir
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.baixo,
    ...data.medio,
    ...data.alto,
    LIMIT_HIGH_RISK,
    1
  );

  return (
    <div className="space-y-4">

      {/* Legenda clicável */}
      <div className="flex gap-6 text-sm">
        <Legend
          label="Baixo"
          color="#22c55e"
          active={visible.baixo}
          onClick={() =>
            setVisible(v => ({ ...v, baixo: !v.baixo }))
          }
        />
        <Legend
          label="Médio"
          color="#eab308"
          active={visible.medio}
          onClick={() =>
            setVisible(v => ({ ...v, medio: !v.medio }))
          }
        />
        <Legend
          label="Alto"
          color="#ef4444"
          active={visible.alto}
          onClick={() =>
            setVisible(v => ({ ...v, alto: !v.alto }))
          }
        />
      </div>

      <svg
        viewBox="0 0 920 420"
        className="w-full h-[420px]"
      >
        {/* Eixos */}
        <line x1="80" y1="30" x2="80" y2="340" stroke="#999" />
        <line x1="80" y1="340" x2="880" y2="340" stroke="#999" />

        {/* Linha de limite */}
        <LimitLine
          value={LIMIT_HIGH_RISK}
          maxValue={maxValue}
        />

        {/* Escala Y */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => {
          const y = 340 - p * 300;
          const value = Math.round(maxValue * p);
          return (
            <g key={p}>
              <line x1="72" y1={y} x2="80" y2={y} stroke="#999" />
              <text
                x="64"
                y={y + 4}
                fontSize="11"
                textAnchor="end"
                fill="#666"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Labels X */}
        {data.labels.map((label, i) => {
          const x = 110 + i * (720 / (data.labels.length - 1));
          return (
            <text
              key={label}
              x={x}
              y={370}
              fontSize="11"
              textAnchor="middle"
              fill="#666"
            >
              {label}
            </text>
          );
        })}

        {visible.baixo &&
          renderLine(data.baixo, '#22c55e', maxValue, false)}

        {visible.medio &&
          renderLine(data.medio, '#eab308', maxValue, false)}

        {visible.alto &&
          renderLine(data.alto, '#ef4444', maxValue, true)}
      </svg>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Legend({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 ${
        active ? 'opacity-100' : 'opacity-40'
      }`}
    >
      <span
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </button>
  );
}

function LimitLine({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) {
  const y = 340 - (value / maxValue) * 300;

  return (
    <g>
      <line
        x1="80"
        y1={y}
        x2="880"
        y2={y}
        stroke="#999"
        strokeDasharray="6 4"
      />
      <text
        x="885"
        y={y + 4}
        fontSize="11"
        fill="#666"
      >
        limite {value}
      </text>
    </g>
  );
}

function renderLine(
  values: number[],
  color: string,
  maxValue: number,
  highlightLast: boolean
) {
  const stepX = 720 / (values.length - 1);

  const points = values.map((value, i) => {
    const x = 110 + i * stepX;
    const y = 340 - (value / maxValue) * 300;
    return { x, y, value };
  });

  return (
    <g>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        opacity={highlightLast ? 1 : 0.6}
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
      />

      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 6 : 4}
              fill={color}
              stroke={isLast ? '#fff' : 'none'}
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={p.y - 10}
              fontSize={isLast ? '12' : '10'}
              fontWeight={isLast ? 'bold' : 'normal'}
              textAnchor="middle"
              fill={color}
            >
              {p.value}
            </text>
          </g>
        );
      })}
    </g>
  );
}
