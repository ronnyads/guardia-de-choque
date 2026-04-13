import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { ShoppingCart, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import OrdersTable from '@/components/admin/OrdersTable';

export const dynamic = 'force-dynamic';

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`;
}

export default async function AdminPedidos() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(500);

  const orderList = orders ?? [];
  const paid    = orderList.filter((o) => o.status === 'paid' || o.status === 'approved');
  const pending = orderList.filter((o) => o.status === 'pending');
  const revenue = paid.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Pedidos</h1>
          <p className="text-[#64748B] text-sm mt-0.5">Acompanhe e gerencie todos os pedidos da sua loja.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: 'Total de Pedidos', value: orderList.length,      color: 'text-[#0F172A]' },
          { icon: CheckCircle2, label: 'Pagos',            value: paid.length,           color: 'text-[#059669]' },
          { icon: Clock,        label: 'Pendentes',        value: pending.length,        color: 'text-[#D97706]' },
          { icon: TrendingUp,   label: 'Receita (pagos)',  value: fmt(revenue),          color: 'text-[#059669]' },
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

      {/* Tabela com tabs + CSV export */}
      <OrdersTable orders={orderList} />
    </div>
  );
}
