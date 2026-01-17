'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  ShieldAlert,
  FileText,
  FileBarChart,
  Settings,
} from 'lucide-react';

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

  const [openCadastros, setOpenCadastros] = useState(true);
  const [openInventario, setOpenInventario] = useState(false);
  const [openPlanos, setOpenPlanos] = useState(false);
  const [openRelatorios, setOpenRelatorios] = useState(false);
  const [openAdministrativo, setOpenAdministrativo] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:3001/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setMe)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  const userInitial = me?.email?.charAt(0).toUpperCase() ?? '?';

  function linkClass(href: string) {
    const active = pathname === href;
    return `
      flex items-center gap-3
      px-4 py-2.5 rounded-lg text-sm transition
      ${
        active
          ? 'bg-blue-600 text-white font-medium shadow-sm'
          : 'text-blue-900/70 hover:bg-blue-100'
      }
    `;
  }

  function mainLinkClass(href: string) {
    const active = pathname === href;
    return `
      flex items-center gap-3
      px-4 py-2.5 rounded-lg transition
      text-[15px] font-semibold
      ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-blue-900 hover:bg-blue-100'
      }
    `;
  }

  function groupButtonClass() {
    return `
      w-full flex items-center justify-between
      px-4 py-2.5 rounded-lg transition
      text-[15px] font-semibold
      text-blue-900 hover:bg-blue-100
    `;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col">
        {/* LOGO */}
        <div className="h-[88px] bg-gradient-to-r from-[#0C1F3F] to-[#16366F] flex items-center border-b border-black/10">
          <div className="relative h-[60px] w-full px-10">
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
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className={mainLinkClass('/dashboard')}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* CADASTROS */}
          <div>
            <button
              onClick={() => setOpenCadastros(v => !v)}
              className={groupButtonClass()}
            >
              <span className="flex items-center gap-3">
                <Users size={18} />
                Cadastros
              </span>
              ▾
            </button>

            {openCadastros && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="/dashboard/times"
                  className={linkClass('/dashboard/times')}
                >
                  <Users size={16} />
                  Times
                </Link>
              </div>
            )}
          </div>

          {/* INVENTÁRIO */}
          <div>
            <button
              onClick={() => setOpenInventario(v => !v)}
              className={groupButtonClass()}
            >
              <span className="flex items-center gap-3">
                <ShieldAlert size={18} />
                Inventário
              </span>
              ▾
            </button>

            {openInventario && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="/dashboard/inventario/riscos"
                  className={linkClass('/dashboard/inventario/riscos')}
                >
                  <ShieldAlert size={16} />
                  Risco ocupacional
                </Link>
              </div>
            )}
          </div>

          {/* PLANOS */}
          <div>
            <button
              onClick={() => setOpenPlanos(v => !v)}
              className={groupButtonClass()}
            >
              <span className="flex items-center gap-3">
                <ClipboardList size={18} />
                Planos de ações
              </span>
              ▾
            </button>

            {openPlanos && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="/dashboard/planos/pgr"
                  className={linkClass('/dashboard/planos/pgr')}
                >
                  <ClipboardList size={16} />
                  Programa de gerenciamento de risco (PGR)
                </Link>
              </div>
            )}
          </div>

          {/* RELATÓRIOS */}
          <div>
            <button
              onClick={() => setOpenRelatorios(v => !v)}
              className={groupButtonClass()}
            >
              <span className="flex items-center gap-3">
                <FileBarChart size={18} />
                Relatórios
              </span>
              ▾
            </button>

            {openRelatorios && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="/dashboard/relatorios/levantamento-riscos"
                  className={linkClass('/dashboard/relatorios/levantamento-riscos')}
                >
                  <FileText size={16} />
                  Levantamento de riscos
                </Link>

                <Link
                  href="/dashboard/relatorios/plano-acao"
                  className={linkClass('/dashboard/relatorios/plano-acao')}
                >
                  <FileText size={16} />
                  Plano de ação
                </Link>
              </div>
            )}
          </div>

          {/* ADMINISTRATIVO */}
          <div>
            <button
              onClick={() => setOpenAdministrativo(v => !v)}
              className={groupButtonClass()}
            >
              <span className="flex items-center gap-3">
                <Settings size={18} />
                Administrativo
              </span>
              ▾
            </button>

            {openAdministrativo && (
              <div className="mt-1 ml-3 space-y-1">
                <Link
                  href="/dashboard/administrativo/entidades"
                  className={linkClass('/dashboard/administrativo/entidades')}
                >
                  <Settings size={16} />
                  Cad. de entidades
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">
        <header className="h-[88px] bg-gradient-to-r from-[#0C1F3F] to-[#16366F] text-white px-12 flex items-center justify-between border-b border-black/15">
          {me && (
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-wide text-blue-200">
                Entidade
              </p>
              <p className="text-xl font-semibold">
                Empresa XYZ Ltda ({me.tenant})
              </p>
            </div>
          )}

          {me && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-4 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-white text-blue-800 flex items-center justify-center font-semibold text-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-medium">{me.email}</span>
                ▾
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-40 bg-white text-gray-800 border rounded-lg shadow-xl py-1 z-50">
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

        <main className="flex-1 px-8 pt-10 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
