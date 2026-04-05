import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { Package, ShoppingCart, Target } from 'lucide-react';

export default async function AdminDashboard() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const [
    { count: productsCount },
    { count: upsellCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('upsell_rules')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Visão Geral</h1>
        <p className="text-[#64748B] text-sm">Acompanhe as métricas e o funil da da operação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Produtos Ativos</span>
            <Package className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{productsCount ?? 0}</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Regras de Funil (Upsell)</span>
            <Target className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{upsellCount ?? 0}</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Pedidos (Geral)</span>
            <ShoppingCart className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{ordersCount ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
