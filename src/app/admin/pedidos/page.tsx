import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPedidos() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
  }

  const orderList = orders ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Pedidos</h1>
          <p className="text-[#64748B] text-sm">Acompanhe os pedidos realizados na sua loja.</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg text-sm font-medium text-[#475569]">
          Total: <span className="text-[#0F172A] font-bold">{orderList.length}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 text-red-700 text-sm">
            Erro ao buscar pedidos. Tente novamente mais tarde.
          </div>
        )}

        {orderList.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-[#CBD5E1] mb-3" />
            <h3 className="text-[#0F172A] font-semibold text-lg">Nenhum pedido ainda</h3>
            <p className="text-[#64748B] text-sm mt-1">
              Os pedidos aparecerão aqui assim que os primeiros clientes comprarem.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {orderList.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-[#94A3B8] font-mono">
                      {order.id?.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-[#475569]">
                      {order.customer_email ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        order.status === 'paid'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : order.status === 'pending'
                          ? 'bg-[#FEF9C3] text-[#854D0E]'
                          : 'bg-[#F1F5F9] text-[#475569]'
                      }`}>
                        {order.status ?? 'desconhecido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">
                      {order.total_amount != null
                        ? `R$ ${Number(order.total_amount).toFixed(2).replace('.', ',')}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748B]">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString('pt-BR')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
