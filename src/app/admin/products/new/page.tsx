import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createProduct } from './actions';
import ProductEditForm from '@/components/admin/ProductEditForm';

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#64748B]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">Novo Produto</h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">Preencha as informações abaixo para criar o produto</p>
          </div>
        </div>
        <button
          form="product-form"
          type="submit"
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Criar Produto
        </button>
      </div>

      <ProductEditForm
        product={null}
        relatedVariants={[]}
        updateAction={createProduct}
        createAction={createProduct}
      />
    </div>
  );
}
