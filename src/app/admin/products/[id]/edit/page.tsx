import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { updateProduct, deleteProduct } from './actions';

interface Props {
  params: Promise<{ id: string }>;
}

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] w-full bg-white';

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .single();

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#64748B]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Editar Produto</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{product.name}</p>
        </div>
      </div>

      <form action={updateProduct} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={product.id} />

        {/* Informações básicas */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Nome do Produto</label>
              <input required type="text" name="name" defaultValue={product.name} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Slug (URL)</label>
              <input type="text" name="slug" defaultValue={product.slug} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Descrição Curta</label>
            <textarea
              rows={3}
              name="description"
              defaultValue={product.description ?? ''}
              className={inputCls}
              placeholder="Descreva o produto..."
            />
          </div>
        </div>

        {/* Precificação e estoque */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Precificação e Estoque</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço De (R$)</label>
              <input required type="number" step="0.01" name="original_price" defaultValue={product.original_price} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço Por (R$)</label>
              <input required type="number" step="0.01" name="promo_price" defaultValue={product.promo_price} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">SKU</label>
              <input type="text" name="sku" defaultValue={product.sku ?? ''} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Qtd. Estoque</label>
              <input type="number" name="inventory_count" defaultValue={product.inventory_count ?? 0} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Status</label>
            <select name="status" defaultValue={product.status} className={`${inputCls} bg-white`}>
              <option value="active">Ativo</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Deletar */}
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              onClick={(e) => { if (!confirm('Excluir este produto permanentemente?')) e.preventDefault(); }}
            >
              <Trash2 className="w-4 h-4" />
              Excluir Produto
            </button>
          </form>

          <button
            type="submit"
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
