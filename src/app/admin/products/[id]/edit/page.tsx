import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { updateProduct } from './actions';
import ArchiveButton from './ArchiveButton';
import ProductEditForm from '@/components/admin/ProductEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

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

  let relatedVariants: { id: string; name: string; promo_price: number; status: string }[] = [];
  if (product.category_id) {
    const { data: variantData } = await supabase
      .from('products')
      .select('id, name, promo_price, status')
      .eq('category_id', product.category_id)
      .eq('tenant_id', tenantId)
      .neq('id', product.id)
      .order('promo_price', { ascending: true });
    relatedVariants = variantData ?? [];
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#64748B]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">{product.name}</h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">ID: {product.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ArchiveButton productId={product.id} />
          <button
            form="product-form"
            type="submit"
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>

      <ProductEditForm
        product={product}
        relatedVariants={relatedVariants}
        updateAction={updateProduct}
        createAction={updateProduct}
      />
    </div>
  );
}
