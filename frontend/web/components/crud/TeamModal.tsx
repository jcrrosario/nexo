'use client';

import { useEffect, useState } from 'react';

type Team = {
  id?: string;
  name: string;
};

type Props = {
  open: boolean;
  team: Team | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TeamModal({
  open,
  team,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(team?.name ?? '');
  }, [team]);

  if (!open) return null;

  async function save() {
    if (!name.trim()) return;

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
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
        }
      );

      if (!res.ok) {
        throw new Error('Erro ao salvar time');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar time');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6">
        <h2 className="text-lg font-semibold mb-4">
          {team ? 'Editar time' : 'Novo time'}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do time"
          className="w-full border rounded-lg px-4 py-2 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
