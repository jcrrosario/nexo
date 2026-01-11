'use client';

import { useEffect, useState } from 'react';
import CrudLayout from '@/components/crud/CrudLayout';
import { CrudTable } from '@/components/crud/CrudTable';
import TeamModal from '@/components/crud/TeamModal';
import CrudLogModal from '@/components/crud/CrudLogModal';
import CrudConfirmModal from '@/components/crud/CrudConfirmModal';

type Team = {
  id: string;
  name: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
};

const LIMIT = 15;

export default function TimesPage() {
  const [data, setData] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editing, setEditing] = useState<Team | null>(null);

  const [logOpen, setLogOpen] = useState(false);
  const [logRow, setLogRow] = useState<Team | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

    setData(json.data ?? []);
    setTotal(json.total ?? 0);
    setTotalPages(json.totalPages ?? 1);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    const token = localStorage.getItem('token');

    await fetch(`http://localhost:3001/team/${deleteId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setConfirmOpen(false);
    setDeleteId(null);
    load();
  }

  const start = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

  return (
    <>
      <CrudLayout
        title="Times"
        action={
          <button
            onClick={() => {
              setEditing(null);
              setModalMode('create');
              setModalOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            👥 Novo time
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
            <div className="flex justify-end gap-4 text-xl">
              {/* Visualizar */}
              <button
                title="Visualizar"
                onClick={() => {
                  setEditing(row);
                  setModalMode('view');
                  setModalOpen(true);
                }}
              >
                👁️
              </button>

              {/* Editar */}
              <button
                title="Editar"
                onClick={() => {
                  setEditing(row);
                  setModalMode('edit');
                  setModalOpen(true);
                }}
              >
                ✏️
              </button>

              {/* Excluir */}
              <button
                title="Excluir"
                onClick={() => {
                  setDeleteId(row.id);
                  setConfirmOpen(true);
                }}
              >
                🗑
              </button>

              {/* Log */}
              <button
                title="Log"
                onClick={() => {
                  setLogRow(row);
                  setLogOpen(true);
                }}
              >
                📄
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

      {/* Modal criar / editar / visualizar */}
      <TeamModal
        open={modalOpen}
        team={editing}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onSuccess={load}
      />

      {/* Modal log */}
      <CrudLogModal
        open={logOpen}
        row={logRow}
        onClose={() => setLogOpen(false)}
      />

      {/* Confirmação de exclusão */}
      <CrudConfirmModal
        open={confirmOpen}
        title="Excluir registro"
        message={`Tem certeza que deseja excluir este registro?\n\nEssa ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
