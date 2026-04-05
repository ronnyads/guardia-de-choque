import { createProduct } from './actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#64748B]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Novo Produto</h1>
        </div>
      </div>

      <form action={createProduct} className="flex flex-col gap-6">
        {/* Bloco Basico */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Nome do Produto</label>
              <input
                required
                type="text"
                name="name"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                placeholder="Ex: Mini Mixer Elétrico"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                placeholder="Ex: mini-mixer-eletrico"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Descrição Curta</label>
            <textarea
              rows={3}
              name="description"
              className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
              placeholder="Descreva o produto..."
            />
          </div>
        </div>

        {/* Bloco Precificação e Estoque */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Precificação e ERP</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço De (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                name="original_price"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço Por (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                name="promo_price"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">SKU</label>
              <input
                type="text"
                name="sku"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
                placeholder="MIXER-01"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Qtd. Estoque</label>
              <input
                type="number"
                name="inventory_count"
                defaultValue="100"
                className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Status</label>
            <select
              name="status"
              defaultValue="active"
              className="border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] bg-white"
            >
              <option value="active">Ativo</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Produto
          </button>
        </div>
      </form>
    </div>
  );
}
