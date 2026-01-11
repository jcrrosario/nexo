'use client';

import { useEffect, useState } from 'react';

type Team = {
  id?: string;
  name: string;
};

type Props = {
  open: boolean;
  team: Team | null;
  mode?: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSuccess?: () => void;
};

export default function TeamModal({
  open,
  team,
  mode = 'create',
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const readOnly = mode === 'view';

  useEffect(() => {
    setName(team?.name ?? '');
  }, [team]);

  if (!open) return null;

  async function save() {
    if (readOnly || !name.trim()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      await fetch(
        team
          ? `http://localhost:3001/team/${team.id}`
          : `http://localhost:3001/team`,
        {
          method: team ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        },
      );

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'view'
            ? 'Visualizar time'
            : team
            ? 'Editar time'
            : 'Novo time'}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={readOnly}
          className={`w-full border rounded-lg px-4 py-2 mb-4 ${
            readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            {readOnly ? 'Fechar' : 'Cancelar'}
          </button>

          {!readOnly && (
            <button
              onClick={save}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
