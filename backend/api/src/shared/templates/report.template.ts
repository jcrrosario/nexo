export function reportTemplate({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: any[][];
}) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #111;
    }

    h1 {
      margin: 0 0 4px 0;
    }

    .meta {
      font-size: 10px;
      color: #555;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background-color: #1e3a8a;
      color: #ffffff;
      padding: 8px;
      text-align: left;
      font-size: 11px;
    }

    td {
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }

    tr:nth-child(even) {
      background-color: #f3f4f6;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    Gerado em ${new Date().toLocaleString('pt-BR')}
  </div>

  <table>
    <thead>
      <tr>
        ${columns.map(col => `<th>${col}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          row =>
            `<tr>${row
              .map(cell => `<td>${cell ?? ''}</td>`)
              .join('')}</tr>`,
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>
`;
}
