"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, RefreshCw, ShoppingCart, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral",  href: "/admin" },
    { icon: Package,         label: "Produtos",     href: "/admin/products" },
    { icon: RefreshCw,       label: "Funis (Upsell)",href: "/admin/funnels" },
    { icon: ShoppingCart,    label: "Pedidos",      href: "/admin/orders" },
    { icon: Settings,        label: "Configurações",href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar sidebar */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#E2E8F0]">
          <span className="font-bold text-[18px] text-[#0F172A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            CommerceOS
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors font-medium text-[14px]"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E2E8F0]">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full hover:bg-red-50 text-[#EF4444] transition-colors font-medium text-[14px]">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header (simples) */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center px-6 md:hidden">
          <span className="font-bold text-[18px]">CommerceOS</span>
        </header>

        {/* Dynamic content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
