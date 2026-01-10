'use client';

type Props = {
  labels: string[];
  alto: number[];
};

export default function RiskSummary({ labels, alto }: Props) {
  if (labels.length < 2 || alto.length < 2) {
    return (
      <p className="text-sm text-gray-600">
        Ainda não há dados suficientes para gerar um resumo.
      </p>
    );
  }

  const first = alto[0];
  const last = alto[alto.length - 1];

  let trend: 'up' | 'down' | 'stable' = 'stable';

  if (last > first) trend = 'up';
  if (last < first) trend = 'down';

  return (
    <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
      {trend === 'down' && (
        <p>
          O risco <strong>alto</strong> apresentou{' '}
          <strong>queda</strong> ao longo do período analisado,
          indicando uma possível melhora no cenário psicossocial.
        </p>
      )}

      {trend === 'up' && (
        <p>
          O risco <strong>alto</strong> apresentou{' '}
          <strong>alta</strong> no período analisado,
          o que pode indicar necessidade de atenção e ações
          preventivas.
        </p>
      )}

      {trend === 'stable' && (
        <p>
          O risco <strong>alto</strong> manteve-se{' '}
          <strong>estável</strong> durante o período analisado.
        </p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Comparação entre {labels[0]} e {labels[labels.length - 1]}.
      </p>
    </div>
  );
}
