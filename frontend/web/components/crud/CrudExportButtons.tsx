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

  const buildUrl = () => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}/export/pdf?${params.toString()}`;
  };

  const handleExport = async () => {
    if (!token) return;

    const res = await fetch(buildUrl(), {
      headers: {
        Authorization: `Bearer ${token}`,
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
    a.download = 'relatorio.pdf';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 rounded-md text-sm font-medium
                 bg-blue-900 text-white hover:bg-blue-800
                 flex items-center gap-2"
    >
      📄 Exportar PDF
    </button>
  );
}
