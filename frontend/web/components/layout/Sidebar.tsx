'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ItemProps = {
  label: string;
  href: string;
};

function SidebarItem({ label, href }: ItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-4 py-2 text-sm
        ${active ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-100'}
      `}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-blue-50">
      {/* logo */}
      <div className="p-4 border-b border-blue-100">
        <span className="font-semibold text-blue-700">NEXO</span>
      </div>

      {/* menu principal */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <SidebarItem label="Dashboard" href="/dashboard" />
        <SidebarItem label="Times" href="/times" />
        <SidebarItem label="Diagnóstico" href="/diagnostico" />
        <SidebarItem label="Ações" href="/acoes" />
      </nav>

      {/* administrativo */}
      <div className="px-3 pb-6">
        <div className="mb-2 text-xs font-semibold text-gray-500">
          Administrativo
        </div>

        <SidebarItem
          label="Entidades"
          href="/administrativo/entidades"
        />
      </div>
    </aside>
  );
}
