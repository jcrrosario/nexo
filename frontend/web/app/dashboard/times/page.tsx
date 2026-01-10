'use client';

import { useEffect, useState } from 'react';
import CrudLayout from '@/components/crud/CrudLayout';
import { CrudTable } from '@/components/crud/CrudTable';
import TeamModal from '@/components/crud/TeamModal';


type Team = {
  id: string;
  name: string;
};

const LIMIT = 15;

export default function TimesPage() {
  const [data, setData] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);

  useEffect(() => {
    load();
  }, [page, search]);

  async function load() {
    const token = localStorage.getItem('token');

    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });

    if (search) params.append('search', search);

    const res = await fetch(
      `http://localhost:3001/team?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const json = await res.json();

    setData(json.data);
    setTotal(json.total);
    setTotalPages(json.totalPages);
  }

  async function remove(id: string) {
    if (!confirm('Deseja remover este time?')) return;

    const token = localStorage.getItem('token');

    await fetch(`http://localhost:3001/team/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    load();
  }

  const start = (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

  return (
    <>
      <CrudLayout
        title="Times"
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="bg-yellow-400 px-4 py-2 rounded-lg font-medium"
          >
            + Novo time
          </button>
        }
      >
        {/* Busca */}
        <div className="flex justify-between items-center mb-6">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Buscar time..."
            className="border rounded-lg px-4 py-2 w-80"
          />

          <span className="text-sm text-gray-500">
            {total} registros
          </span>
        </div>

        {/* Tabela */}
        <CrudTable
          columns={[{ key: 'name', label: 'Nome do time' }]}
          data={data}
          actions={(row: Team) => (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(row);
                  setModalOpen(true);
                }}
                className="text-blue-600"
              >
                ✏️
              </button>
              <button
                onClick={() => remove(row.id)}
                className="text-red-600"
              >
                🗑
              </button>
            </div>
          )}
        />

        {/* Paginação */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">
            Exibindo {start}–{end} de {total}
          </span>

          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        </div>
      </CrudLayout>

      {/* Modal */}
      <TeamModal
        open={modalOpen}
        team={editing}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />
    </>
  );
}
