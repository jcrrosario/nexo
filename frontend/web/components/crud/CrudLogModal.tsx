'use client';

type Props = {
  open: boolean;
  row: {
    user_id?: string;
    created_at?: string;
    updated_at?: string;
  } | null;
  onClose: () => void;
};

export default function CrudLogModal({
  open,
  row,
  onClose,
}: Props) {
  if (!open || !row) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-4">
          Log do registro
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">
              Criado por
            </label>
            <input
              readOnly
              value={row.user_id ?? '-'}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Data de criação
            </label>
            <input
              readOnly
              value={row.created_at ?? '-'}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Última alteração
            </label>
            <input
              readOnly
              value={row.updated_at ?? '-'}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
