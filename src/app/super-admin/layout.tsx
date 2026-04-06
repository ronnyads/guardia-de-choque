"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, LogOut } from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/super-admin" },
    { icon: Store,           label: "Lojas",       href: "/super-admin/lojas" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="w-64 bg-[#0F172A] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div>
            <span className="font-bold text-[17px] text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              CommerceOS
            </span>
            <span className="ml-2 text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
              Super Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-[14px] ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-400 hover:bg-white/5 transition-colors font-medium text-[14px]"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-6 md:hidden">
          <span className="font-bold text-[18px]">CommerceOS</span>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
