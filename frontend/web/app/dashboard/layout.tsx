'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type MeResponse = {
  tenant: string;   // ex: 1233
  email: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [me, setMe] = useState<MeResponse | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMe)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  const menu = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Times', href: '/dashboard/times' },
    { label: 'Diagnóstico', href: '/dashboard/diagnostico' },
    { label: 'Ações', href: '/dashboard/acoes' },
  ];

  const userInitial =
    me?.email?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <h1 className="text-xl font-bold text-blue-900">
          NEXO
        </h1>

        <nav className="space-y-2">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">

          {/* Entidade */}
          {me && (
            <div className="leading-tight">
              <p className="text-xs text-gray-500">
                Entidade
              </p>
              <p className="text-lg font-semibold text-blue-900">
                Empresa XYZ Ltda ({me.tenant})
              </p>
            </div>
          )}

          {/* Usuário */}
          {me && (
            <div
              ref={menuRef}
              className="relative"
            >
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                  {userInitial}
                </div>

                <span className="text-sm text-gray-800">
                  {me.email}
                </span>

                <span
                  className={`text-xs text-gray-400 transition ${
                    open ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Page */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
