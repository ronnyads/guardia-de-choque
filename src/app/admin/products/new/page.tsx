import { createProduct } from './actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0F172A] w-full bg-white';

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
        {/* Informações básicas */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Nome do Produto</label>
              <input
                required
                type="text"
                name="name"
                className={inputCls}
                placeholder="Ex: Mini Mixer Elétrico"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Slug (URL)</label>
              <input
                type="text"
                name="slug"
                className={inputCls}
                placeholder="Ex: mini-mixer-eletrico"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Descrição Curta</label>
            <textarea
              rows={3}
              name="description"
              className={inputCls}
              placeholder="Descreva o produto..."
            />
          </div>
        </div>

        {/* Conteúdo Detalhado */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Conteúdo Detalhado</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Descrição Longa</label>
            <textarea
              rows={6}
              name="long_description"
              className={inputCls}
              placeholder="Descrição completa do produto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Badge</label>
              <select name="badge" className={inputCls}>
                <option value="">Nenhum</option>
                <option value="Mais Vendido">Mais Vendido</option>
                <option value="Kit">Kit</option>
                <option value="Oferta">Oferta</option>
                <option value="Novo">Novo</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Categoria (slug)</label>
              <input
                type="text"
                name="category_id"
                className={inputCls}
                placeholder="defesa-pessoal"
              />
            </div>
          </div>
        </div>

        {/* Imagens */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Imagens</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">URLs das Imagens (uma por linha)</label>
            <textarea
              rows={4}
              name="images"
              className={inputCls}
              placeholder="/images/product/foto.png"
            />
            <p className="text-xs text-[#94A3B8]">Cole uma URL por linha. Exemplos: /images/product/foto.png ou https://...</p>
          </div>
        </div>

        {/* Features e Especificações */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Features e Especificações</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Features (JSON)</label>
            <textarea
              rows={6}
              name="features"
              className={inputCls}
              placeholder={'[{"icon": "zap", "title": "Titulo", "description": "Texto"}]'}
            />
            <p className="text-xs text-[#94A3B8]">{`Formato: [{"icon": "zap", "title": "Titulo", "description": "Texto"}]`}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Especificações (JSON)</label>
            <textarea
              rows={4}
              name="specs"
              className={inputCls}
              placeholder={'[{"label": "Peso", "value": "180g"}]'}
            />
            <p className="text-xs text-[#94A3B8]">{`Formato: [{"label": "Peso", "value": "180g"}]`}</p>
          </div>
        </div>

        {/* Precificação e Estoque */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col gap-4">
          <h2 className="font-semibold text-[#0F172A] text-lg">Precificação e Estoque</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço De (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                name="original_price"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Preço Por (R$)</label>
              <input
                required
                type="number"
                step="0.01"
                name="promo_price"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">SKU</label>
              <input
                type="text"
                name="sku"
                className={inputCls}
                placeholder="MIXER-01"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#475569]">Qtd. Estoque</label>
              <input
                type="number"
                name="inventory_count"
                defaultValue="100"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#475569]">Status</label>
            <select
              name="status"
              defaultValue="active"
              className={inputCls}
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
            Criar Produto
          </button>
        </div>
      </form>
    </div>
  );
}
