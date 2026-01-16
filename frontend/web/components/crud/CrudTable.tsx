'use client';

type Column = {
  key: string;
  label: string;
  sortable?: boolean;
};

type Props<T> = {
  columns: Column[];
  data?: T[]; // opcional de propósito
  actions?: (row: T) => React.ReactNode;

  // ordenação (opcional)
  sort?: string | null;
  order?: 'asc' | 'desc';
  onSort?: (sort: string, order: 'asc' | 'desc') => void;
};

export function CrudTable<T extends { id: string }>({
  columns,
  data = [],
  actions,
  sort,
  order = 'asc',
  onSort,
}: Props<T>) {
  function handleSort(col: Column) {
    if (!col.sortable || !onSort) return;

    if (sort === col.key) {
      onSort(col.key, order === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-900 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col)}
                className={`px-4 py-3 text-left text-sm font-medium ${
                  col.sortable && onSort
                    ? 'cursor-pointer select-none'
                    : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  {col.label}

                  {col.sortable && sort === col.key && (
                    <span className="text-xs">
                      {order === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </span>
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
