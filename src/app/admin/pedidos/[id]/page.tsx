import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, CreditCard, Mail, Phone, MapPin, Package,
  Hash, Calendar, Clock, ExternalLink, Copy, CheckCircle2,
  Truck, FileText, ShieldCheck, User,
} from "lucide-react";
import { requireTenant } from "@/lib/tenant";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  StatusSelector,
  TrackingForm,
  NotesForm,
  QuickActions,
} from "@/components/admin/OrderDetailActions";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  pending:   { label: "Pendente",    bg: "bg-[#FEF9C3]", color: "text-[#854D0E]", dot: "bg-[#D97706]" },
  approved:  { label: "Aprovado",    bg: "bg-[#DCFCE7]", color: "text-[#166534]", dot: "bg-[#16A34A]" },
  failed:    { label: "Falhou",      bg: "bg-[#FEE2E2]", color: "text-[#991B1B]", dot: "bg-[#DC2626]" },
  refunded:  { label: "Reembolsado", bg: "bg-[#EDE9FE]", color: "text-[#5B21B6]", dot: "bg-[#7C3AED]" },
  cancelled: { label: "Cancelado",   bg: "bg-[#F1F5F9]", color: "text-[#475569]", dot: "bg-[#94A3B8]" },
};

const PAY_LABEL: Record<string, string> = {
  pix: "PIX", card: "Cartão de Crédito",
};
const PROVIDER_LABEL: Record<string, string> = {
  mercadopago: "Mercado Pago", stripe: "Stripe",
};

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function initials(name?: string | null) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (!order) notFound();

  const status = STATUS_MAP[order.status] ?? STATUS_MAP.pending;
  const items: Array<{ slug?: string; name?: string; price?: number; qty?: number }> =
    Array.isArray(order.items) ? order.items : [];
  const addr = order.customer_address as Record<string, string> | null;

  // calcula desconto PIX se aplicável
  const isPix = order.payment_method === "pix";
  const itemsSubtotal = items.reduce((s, i) => s + (Number(i.price ?? 0) * (i.qty ?? 1)), 0);

  // Histórico de linha do tempo sintético
  const timeline = [
    { icon: Calendar,     label: "Pedido criado",        time: order.created_at,  color: "bg-[#E0F2FE] text-[#0369A1]" },
    order.status === "approved"  && { icon: CheckCircle2, label: "Pagamento aprovado",    time: order.updated_at, color: "bg-[#DCFCE7] text-[#166534]" },
    order.status === "refunded"  && { icon: FileText,     label: "Reembolso processado",  time: order.updated_at, color: "bg-[#EDE9FE] text-[#5B21B6]" },
    order.status === "cancelled" && { icon: FileText,     label: "Pedido cancelado",       time: order.updated_at, color: "bg-[#FEE2E2] text-[#991B1B]" },
    order.tracking_code && { icon: Truck,          label: `Rastreio adicionado: ${order.tracking_code}`, time: order.updated_at, color: "bg-[#FEF9C3] text-[#854D0E]" },
  ].filter(Boolean) as Array<{ icon: React.ElementType; label: string; time: string; color: string }>;

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Link
          href="/admin/pedidos"
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Pedidos
        </Link>
        <span className="hidden sm:block text-[#CBD5E1]">/</span>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-[#0F172A] font-mono">
            #{order.id?.slice(0, 8).toUpperCase()}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <span className="text-xs text-[#94A3B8]">{fmtDate(order.created_at)}</span>
        </div>
      </div>

      {/* Quick actions bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
        <QuickActions orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ── LEFT COLUMN (2/3) ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Itens do pedido */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Itens do Pedido</h2>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {items.length === 0 ? (
                <p className="px-5 py-6 text-sm text-[#94A3B8] text-center">Nenhum item registrado.</p>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F1F5F9] rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#94A3B8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{item.name ?? item.slug ?? "Produto"}</p>
                      {item.slug && <p className="text-xs text-[#94A3B8] mt-0.5">{item.slug}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-[#94A3B8]">Qtd: {item.qty ?? 1}</p>
                      <p className="text-sm font-bold text-[#0F172A]">{fmt(Number(item.price ?? 0))}</p>
                      {(item.qty ?? 1) > 1 && (
                        <p className="text-xs text-[#64748B]">
                          Total: {fmt(Number(item.price ?? 0) * (item.qty ?? 1))}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Totais */}
            <div className="border-t border-[#E2E8F0] px-5 py-4 space-y-2 bg-[#FAFAFA]">
              <div className="flex justify-between text-sm text-[#64748B]">
                <span>Subtotal</span>
                <span>{fmt(itemsSubtotal || Number(order.total_amount))}</span>
              </div>
              <div className="flex justify-between text-sm text-[#059669]">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Frete</span>
                <span className="font-semibold">Grátis</span>
              </div>
              {isPix && (
                <div className="flex justify-between text-sm text-[#059669]">
                  <span>Desconto PIX (5%)</span>
                  <span>-{fmt((itemsSubtotal || Number(order.total_amount)) * 0.0526)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
                <span>Total</span>
                <span>{fmt(Number(order.total_amount))}</span>
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Pagamento</h2>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">Método</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F1F5F9] text-[#0F172A] text-sm font-semibold rounded-lg">
                  {PAY_LABEL[order.payment_method] ?? order.payment_method ?? "—"}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">Gateway</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F1F5F9] text-[#0F172A] text-sm font-semibold rounded-lg">
                  {PROVIDER_LABEL[order.payment_provider] ?? order.payment_provider ?? "—"}
                </span>
              </div>
              {order.external_payment_id && (
                <div className="col-span-2">
                  <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">ID do Pagamento</p>
                  <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2">
                    <Hash className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <span className="font-mono text-xs text-[#475569] flex-1 truncate">{order.external_payment_id}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-1">Status do Pedido</p>
                <StatusSelector orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          </div>

          {/* Rastreio */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Rastreio</h2>
            </div>
            <div className="px-5 py-4">
              {order.tracking_code && (
                <div className="flex items-center gap-2 bg-[#DCFCE7] border border-[#BBF7D0] rounded-lg px-3 py-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span className="text-sm font-semibold text-[#166534] font-mono">{order.tracking_code}</span>
                </div>
              )}
              <TrackingForm orderId={order.id} currentTracking={order.tracking_code} />
            </div>
          </div>

          {/* Notas internas */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Notas Internas</h2>
              <span className="ml-auto text-xs text-[#94A3B8]">Visível apenas para você</span>
            </div>
            <div className="px-5 py-4">
              <NotesForm orderId={order.id} currentNotes={order.internal_notes} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Histórico</h2>
            </div>
            <div className="px-5 py-5">
              <ol className="relative border-l-2 border-[#E2E8F0] space-y-6 ml-2">
                {timeline.map((event, idx) => (
                  <li key={idx} className="relative pl-6">
                    <span className={`absolute -left-[17px] w-8 h-8 rounded-full flex items-center justify-center ${event.color}`}>
                      <event.icon className="w-3.5 h-3.5" />
                    </span>
                    <p className="text-sm font-semibold text-[#0F172A]">{event.label}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{event.time ? fmtDate(event.time) : "—"}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (1/3) ── */}
        <div className="flex flex-col gap-6">

          {/* Cliente */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <User className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Cliente</h2>
            </div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Avatar + nome */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {initials(order.customer_name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{order.customer_name ?? "—"}</p>
                  <p className="text-xs text-[#94A3B8]">Cliente</p>
                </div>
              </div>
              {/* Contato */}
              <div className="space-y-2.5">
                {order.customer_email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <a
                      href={`mailto:${order.customer_email}`}
                      className="text-[#6366F1] hover:underline truncate"
                    >
                      {order.customer_email}
                    </a>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                    <a href={`tel:${order.customer_phone}`} className="text-[#475569] hover:text-[#0F172A]">
                      {order.customer_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Endereço de entrega */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Endereço de Entrega</h2>
            </div>
            <div className="px-5 py-4">
              {addr ? (
                <address className="not-italic text-sm text-[#475569] space-y-1">
                  {addr.street && (
                    <p>{addr.street}{addr.number ? `, ${addr.number}` : ""}{addr.complement ? ` - ${addr.complement}` : ""}</p>
                  )}
                  {addr.neighborhood && <p>{addr.neighborhood}</p>}
                  {(addr.city || addr.state) && (
                    <p>{[addr.city, addr.state].filter(Boolean).join(" - ")}</p>
                  )}
                  {addr.cep && <p className="font-mono text-xs text-[#94A3B8]">CEP: {addr.cep}</p>}
                </address>
              ) : (
                <p className="text-sm text-[#94A3B8]">Endereço não registrado.</p>
              )}
            </div>
          </div>

          {/* Resumo rápido */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-semibold text-[#0F172A] text-sm">Resumo</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Criado em</span>
                <span className="text-[#0F172A] font-medium text-right text-xs">{fmtDate(order.created_at)}</span>
              </div>
              {order.updated_at && order.updated_at !== order.created_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Atualizado</span>
                  <span className="text-[#0F172A] font-medium text-right text-xs">{fmtDate(order.updated_at)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Total</span>
                <span className="text-[#0F172A] font-bold">{fmt(Number(order.total_amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Itens</span>
                <span className="text-[#0F172A] font-medium">{items.length}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
