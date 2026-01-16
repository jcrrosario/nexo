'use client';

type Props = {
  endpoint: string;
  query: Record<string, any>;
};

export default function CrudExportButtons({
  endpoint,
  query,
}: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const tenant =
    typeof window !== 'undefined'
      ? localStorage.getItem('tenant')
      : null;

  const buildUrl = (type: 'pdf' | 'excel') => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}/export/${type}?${params.toString()}`;
  };

  async function handleExport(type: 'pdf' | 'excel') {
    if (!token) return;

    const res = await fetch(buildUrl(type), {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-tenant-id': tenant ?? '',
      },
    });

    if (!res.ok) {
      alert('Erro ao gerar relatório');
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download =
      type === 'pdf' ? 'relatorio.pdf' : 'relatorio.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('pdf')}
        className="px-4 py-2 rounded-md text-sm font-medium
                   bg-blue-900 text-white hover:bg-blue-800
                   flex items-center gap-2"
      >
        📄 PDF
      </button>

      <button
        onClick={() => handleExport('excel')}
        className="px-4 py-2 rounded-md text-sm font-medium
                   bg-emerald-600 text-white hover:bg-emerald-500
                   flex items-center gap-2"
      >
        📊 Excel
      </button>
    </div>
  );
}
