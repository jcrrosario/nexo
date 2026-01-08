'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Dashboard
          </span>

          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Sair
          </button>
        </header>

        {/* Page */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
