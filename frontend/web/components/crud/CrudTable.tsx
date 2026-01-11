'use client';

type Column = {
  key: string;
  label: string;
};

type Props<T> = {
  columns: Column[];
  data?: T[]; // 👈 opcional de propósito
  actions?: (row: T) => React.ReactNode;
};

export function CrudTable<T extends { id: string }>({
  columns,
  data = [], // 👈 valor padrão blindado
  actions,
}: Props<T>) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-900 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-medium"
              >
                {col.label}
              </th>
            ))}

            {actions && (
              <th className="px-4 py-3 text-right text-sm font-medium">
                Ações
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Nenhum registro encontrado
              </td>
            </tr>
          )}

          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-800"
                >
                  {(row as any)[col.key]}
                </td>
              ))}

              {actions && (
                <td className="px-4 py-3 text-right">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
