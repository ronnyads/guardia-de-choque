import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminProductsPage() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, status, inventory_count, promo_price, images')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  const productList = products ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Produtos</h1>
          <p className="text-[#64748B] text-sm">Gerencie seu catálogo de produtos (SKUs).</p>
        </div>
        <Link href="/admin/products/new" className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Produto
        </Link>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
        {productList.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Package className="w-12 h-12 text-[#CBD5E1] mb-3" />
            <h3 className="text-[#0F172A] font-semibold text-lg">Nenhum produto encontrado</h3>
            <p className="text-[#64748B] text-sm mt-1">Sua loja ainda não tem produtos cadastrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Preço (R$)</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex-shrink-0 overflow-hidden relative">
                          {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#94A3B8] m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0F172A] text-sm">{product.name}</div>
                          <div className="text-xs text-[#94A3B8]">{product.sku || 'Sem SKU'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        product.status === 'active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF9C3] text-[#854D0E]'
                      }`}>
                        {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#475569]">
                      {product.inventory_count} unid.
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#0F172A]">
                      R$ {(product.promo_price ?? 0).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Link>
                      </div>
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
