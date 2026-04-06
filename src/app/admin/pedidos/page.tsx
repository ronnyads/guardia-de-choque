import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { ShoppingCart, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  paid:      { label: 'Pago',      cls: 'bg-[#DCFCE7] text-[#166534]' },
  approved:  { label: 'Aprovado',  cls: 'bg-[#DCFCE7] text-[#166534]' },
  pending:   { label: 'Pendente',  cls: 'bg-[#FEF9C3] text-[#854D0E]' },
  cancelled: { label: 'Cancelado', cls: 'bg-[#FEE2E2] text-[#991B1B]' },
  refunded:  { label: 'Reembolso', cls: 'bg-[#F1F5F9] text-[#475569]' },
};

function fmt(v: number) {
  return v.toFixed(2).replace('.', ',');
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function AdminPedidos() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(100);

  const orderList = orders ?? [];

  const paid    = orderList.filter(o => o.status === 'paid' || o.status === 'approved');
  const pending = orderList.filter(o => o.status === 'pending');
  const revenue = paid.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Pedidos</h1>
        <p className="text-[#64748B] text-sm">Acompanhe todos os pedidos da sua loja.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Total de Pedidos', value: orderList.length, color: 'text-[#0F172A]' },
          { icon: CheckCircle2, label: 'Pagos',            value: paid.length,      color: 'text-[#059669]' },
          { icon: Clock,        label: 'Pendentes',        value: pending.length,   color: 'text-[#D97706]' },
          { icon: TrendingUp,   label: 'Receita (pagos)',  value: `R$ ${fmt(revenue)}`, color: 'text-[#059669]' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-xs text-[#64748B] font-medium">{kpi.label}</span>
            </div>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
        {orderList.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-[#CBD5E1]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] font-semibold text-lg">Nenhum pedido ainda</h3>
              <p className="text-[#64748B] text-sm mt-1 max-w-xs mx-auto">
                Os pedidos aparecerão aqui assim que os primeiros clientes comprarem.
                <br />
                <span className="text-xs text-[#94A3B8] mt-1 block">Nota: a gravação automática de pedidos será ativada em breve.</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Pedido</th>
                  <th className="px-6 py-3.5">Cliente</th>
                  <th className="px-6 py-3.5">Produto</th>
                  <th className="px-6 py-3.5">Pagamento</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Valor</th>
                  <th className="px-6 py-3.5">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {orderList.map((order) => {
                  const status = STATUS_MAP[order.status] ?? { label: order.status ?? '—', cls: 'bg-[#F1F5F9] text-[#475569]' };
                  return (
                    <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-[#94A3B8]">
                        #{order.id?.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#0F172A]">{order.customer_name ?? '—'}</div>
                        <div className="text-xs text-[#94A3B8]">{order.customer_email ?? ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {order.product_name ?? order.kit_id ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-[#475569] bg-[#F1F5F9] px-2 py-1 rounded-md uppercase">
                          {order.payment_method ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0F172A] text-right tabular-nums">
                        {order.total_amount != null ? `R$ ${fmt(Number(order.total_amount))}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">
                        {order.created_at ? fmtDate(order.created_at) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
