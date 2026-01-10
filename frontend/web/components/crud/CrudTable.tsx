export function CrudTable({
  columns,
  data,
  actions,
}: any) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-blue-900 text-white">
        <tr>
          {columns.map((c: any) => (
            <th key={c.key} className="px-4 py-3 text-left">
              {c.label}
            </th>
          ))}
          <th className="px-4 py-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id} className="border-b hover:bg-gray-50">
            {columns.map((c: any) => (
              <td key={c.key} className="px-4 py-3">
                {row[c.key]}
              </td>
            ))}
            <td className="px-4 py-3 flex gap-3">
              {actions(row)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
