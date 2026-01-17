'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type MeResponse = {
  tenant: string;
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

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col">

        {/* ÁREA DA LOGO */}
        <div className="h-[72px] bg-blue-800 flex items-center justify-center">
          <div className="relative h-14 w-full px-6">
            <Image
              src="/logo-nexo.png"
              alt="NEXO"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3
                  px-4 py-2.5
                  rounded-lg
                  text-sm
                  transition
                  ${
                    active
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-blue-900/70 hover:bg-blue-100'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-[72px] bg-blue-800 text-white px-10 flex items-center justify-between shadow">
          {me && (
            <div className="leading-tight">
              <p className="text-xs text-blue-200">
                Entidade
              </p>
              <p className="text-lg font-semibold">
                Empresa XYZ Ltda ({me.tenant})
              </p>
            </div>
          )}

          {me && (
            <div
              ref={menuRef}
              className="relative"
            >
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-white text-blue-800 flex items-center justify-center font-semibold text-sm">
                  {userInitial}
                </div>

                <span className="text-sm">
                  {me.email}
                </span>

                <span
                  className={`text-xs transition ${
                    open ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 border rounded-lg shadow-lg py-1 z-50">
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

        {/* PAGE */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
