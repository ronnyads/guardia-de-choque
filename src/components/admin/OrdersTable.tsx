"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  product_name?: string | null;
  kit_id?: string | null;
  payment_method?: string | null;
  status?: string | null;
  total_amount?: number | null;
  tracking_code?: string | null;
  items?: unknown;
  created_at?: string | null;
}

interface Props { orders: Order[] }

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  paid:      { label: "Pago",       cls: "bg-[#DCFCE7] text-[#166534]" },
  approved:  { label: "Aprovado",   cls: "bg-[#DCFCE7] text-[#166534]" },
  pending:   { label: "Pendente",   cls: "bg-[#FEF9C3] text-[#854D0E]" },
  failed:    { label: "Falhou",     cls: "bg-[#FEE2E2] text-[#991B1B]" },
  cancelled: { label: "Cancelado",  cls: "bg-[#F1F5F9] text-[#475569]" },
  refunded:  { label: "Reembolsado",cls: "bg-[#EDE9FE] text-[#5B21B6]" },
};

const FULFILL_MAP = (hasTracking: boolean) => hasTracking
  ? { label: "Enviado",          cls: "bg-[#E0F2FE] text-[#0369A1]" }
  : { label: "Não processado",   cls: "bg-[#FEF9C3] text-[#854D0E]" };

const PAY_LABEL: Record<string, string> = { pix: "PIX", card: "Cartão" };

function fmt(v: number) { return `R$ ${v.toFixed(2).replace(".", ",")}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}
function itemCount(items: unknown): number {
  return Array.isArray(items) ? items.length : 0;
}

const TABS = [
  { label: "Todos",           filter: null },
  { label: "Não processados", filter: "pending" },
  { label: "Pagos",           filter: "approved" },
  { label: "Cancelados",      filter: "cancelled" },
  { label: "Reembolsados",    filter: "refunded" },
];

function exportCsv(orders: Order[]) {
  const header = ["Pedido", "Cliente", "Email", "Telefone", "Total", "Método", "Status", "Itens", "Data"];
  const rows = orders.map((o) => [
    `#${o.id?.slice(0, 8).toUpperCase()}`,
    o.customer_name ?? "",
    o.customer_email ?? "",
    o.customer_phone ?? "",
    o.total_amount != null ? Number(o.total_amount).toFixed(2) : "",
    PAY_LABEL[o.payment_method ?? ""] ?? o.payment_method ?? "",
    STATUS_MAP[o.status ?? ""]?.label ?? o.status ?? "",
    String(itemCount(o.items)),
    o.created_at ? fmtDate(o.created_at) : "",
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedidos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function OrdersTable({ orders }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const filtered = activeTab ? orders.filter((o) => o.status === activeTab) : orders;

  const counts = Object.fromEntries(
    TABS.map((t) => [t.filter ?? "__all", t.filter ? orders.filter((o) => o.status === t.filter).length : orders.length])
  );

  return (
    <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
      {/* Tabs + export */}
      <div className="flex items-center border-b border-[#E2E8F0] px-1 gap-0.5 overflow-x-auto">
        <div className="flex-1 flex">
          {TABS.map((tab) => {
            const count = counts[tab.filter ?? "__all"];
            const active = activeTab === tab.filter;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.filter)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                  active
                    ? "border-[#0F172A] text-[#0F172A]"
                    : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => exportCsv(filtered)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg mx-3 my-2 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" /> Exportar CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-[#CBD5E1]" />
          </div>
          <div>
            <h3 className="text-[#0F172A] font-semibold text-lg">Nenhum pedido</h3>
            <p className="text-[#64748B] text-sm mt-1">Nenhum pedido encontrado neste filtro.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] text-xs uppercase tracking-wider font-semibold">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Status Pagamento</th>
                <th className="px-5 py-3">Processamento</th>
                <th className="px-5 py-3">Itens</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Forma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((order) => {
                const pay = STATUS_MAP[order.status ?? ""] ?? { label: order.status ?? "—", cls: "bg-[#F1F5F9] text-[#475569]" };
                const fulfill = FULFILL_MAP(!!order.tracking_code);
                const n = itemCount(order.items);
                return (
                  <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group relative">
                    <td className="px-5 py-3.5 relative">
                      <Link href={`/admin/pedidos/${order.id}`} className="absolute inset-0" aria-label="Ver pedido" />
                      <p className="font-mono text-sm font-bold text-[#0F172A] group-hover:text-[#6366F1] transition-colors">
                        #{order.id?.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{order.created_at ? fmtDate(order.created_at) : "—"}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-[#0F172A]">{order.customer_name ?? "—"}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{order.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${pay.cls}`}>
                        {pay.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${fulfill.cls}`}>
                        {fulfill.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#475569]">
                      {n > 0 ? `${n} item${n !== 1 ? "s" : ""}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[#0F172A] text-right tabular-nums">
                      {order.total_amount != null ? fmt(Number(order.total_amount)) : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-md">
                        {PAY_LABEL[order.payment_method ?? ""] ?? order.payment_method ?? "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
