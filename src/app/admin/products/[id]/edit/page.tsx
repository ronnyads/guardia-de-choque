import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ArrowRight, Plus } from 'lucide-react';
import { updateProduct } from './actions';
import ArchiveButton from './ArchiveButton';

interface Props {
  params: Promise<{ id: string }>;
}

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] w-full bg-white transition-colors';
const labelCls = 'block text-sm font-medium text-[#374151] mb-1.5';
const sectionCls = 'bg-white rounded-xl border border-[#E2E8F0] shadow-sm';

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

  // Buscar variantes da mesma categoria (outros produtos relacionados)
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

  const margin = product.cost_price && product.promo_price
    ? Math.round(((product.promo_price - product.cost_price) / product.promo_price) * 100)
    : null;

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
            form="edit-product-form"
            type="submit"
            className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>

      <form id="edit-product-form" action={updateProduct}>
        <input type="hidden" name="id" value={product.id} />

        {/* Layout 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna principal (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Informações básicas */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Informações Básicas</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Título do Produto</label>
                  <input required type="text" name="name" defaultValue={product.name} className={inputCls} placeholder="Ex: Guardiã de Choque Premium" />
                </div>
                <div>
                  <label className={labelCls}>Descrição Curta</label>
                  <textarea rows={3} name="description" defaultValue={product.description ?? ''} className={inputCls} placeholder="Aparece nos cards e nas buscas..." />
                </div>
                <div>
                  <label className={labelCls}>Descrição Longa</label>
                  <textarea rows={6} name="long_description" defaultValue={product.long_description ?? ''} className={inputCls} placeholder="Descrição completa exibida na página do produto..." />
                </div>
              </div>
            </div>

            {/* Imagens */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Imagens</h2>
              </div>
              <div className="p-6">
                {product.images && product.images.length > 0 && (
                  <div className="flex gap-3 flex-wrap mb-4">
                    {product.images.map((img: string, i: number) => (
                      <div key={i} className="w-20 h-20 rounded-lg border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC] relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Imagem ${i+1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <label className={labelCls}>URLs das Imagens <span className="text-[#94A3B8] font-normal">(uma por linha)</span></label>
                <textarea rows={4} name="images" defaultValue={product.images?.join('\n') ?? ''} className={inputCls} placeholder="/images/product/foto.png&#10;https://exemplo.com/imagem.jpg" />
                <p className="text-xs text-[#94A3B8] mt-1.5">A primeira imagem será a principal. Suporte a URLs relativas e absolutas.</p>
              </div>
            </div>

            {/* Precificação */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Precificação</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Preço De (R$) <span className="text-[#94A3B8] font-normal">— riscado</span></label>
                    <input type="number" step="0.01" name="original_price" defaultValue={product.original_price} className={inputCls} placeholder="0,00" />
                  </div>
                  <div>
                    <label className={labelCls}>Preço Por (R$) <span className="text-[#94A3B8] font-normal">— venda</span></label>
                    <input required type="number" step="0.01" name="promo_price" defaultValue={product.promo_price} className={inputCls} placeholder="0,00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Custo do Produto (R$)</label>
                    <input type="number" step="0.01" name="cost_price" defaultValue={product.cost_price ?? ''} className={inputCls} placeholder="0,00" />
                    <p className="text-xs text-[#94A3B8] mt-1">Usado para calcular margem. Não aparece para o cliente.</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    {margin !== null ? (
                      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 text-center">
                        <p className="text-xs text-[#166534] font-medium">Margem estimada</p>
                        <p className={`text-2xl font-black ${margin >= 30 ? 'text-[#059669]' : margin >= 15 ? 'text-yellow-600' : 'text-red-500'}`}>{margin}%</p>
                      </div>
                    ) : (
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-center">
                        <p className="text-xs text-[#94A3B8]">Informe o custo para ver a margem</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features e Specs */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Features e Especificações</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Features (JSON)</label>
                  <textarea rows={5} name="features" defaultValue={JSON.stringify(product.features ?? [], null, 2)} className={`${inputCls} font-mono text-xs`} />
                  <p className="text-xs text-[#94A3B8] mt-1">{`[{"icon": "zap", "title": "Titulo", "description": "Texto"}]`}</p>
                </div>
                <div>
                  <label className={labelCls}>Especificações Técnicas (JSON)</label>
                  <textarea rows={4} name="specs" defaultValue={JSON.stringify(product.specs ?? [], null, 2)} className={`${inputCls} font-mono text-xs`} />
                  <p className="text-xs text-[#94A3B8] mt-1">{`[{"label": "Peso", "value": "180g"}]`}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna lateral (1/3) */}
          <div className="flex flex-col gap-6">

            {/* Status */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Status</h2>
              </div>
              <div className="p-6">
                <select name="status" defaultValue={product.status} className={inputCls}>
                  <option value="active">✓ Ativo — visível na loja</option>
                  <option value="draft">◦ Rascunho — oculto</option>
                  <option value="archived">✕ Arquivado</option>
                </select>
              </div>
            </div>

            {/* Organização */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Organização</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Categoria</label>
                  <input type="text" name="category_id" defaultValue={product.category_id ?? ''} className={inputCls} placeholder="defesa-pessoal" />
                </div>
                <div>
                  <label className={labelCls}>Badge</label>
                  <select name="badge" defaultValue={product.badge ?? ''} className={inputCls}>
                    <option value="">Sem badge</option>
                    <option value="Mais Vendido">Mais Vendido</option>
                    <option value="Kit">Kit</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Novo">Novo</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input type="text" name="slug" defaultValue={product.slug} className={inputCls} placeholder="nome-do-produto" />
                  <p className="text-xs text-[#94A3B8] mt-1">guardiadechoque.online/produto/<strong>{product.slug}</strong></p>
                </div>
              </div>
            </div>

            {/* Estoque */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Estoque</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>SKU</label>
                  <input type="text" name="sku" defaultValue={product.sku ?? ''} className={inputCls} placeholder="PROD-001" />
                </div>
                <div>
                  <label className={labelCls}>Quantidade em estoque</label>
                  <input type="number" name="inventory_count" defaultValue={product.inventory_count ?? 0} className={inputCls} min="0" />
                </div>
              </div>
            </div>

            {/* Avaliações */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Avaliações</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Nota média (0–5)</label>
                  <input type="number" step="0.1" min="0" max="5" name="rating" defaultValue={product.rating ?? 0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Total de avaliações</label>
                  <input type="number" min="0" name="review_count" defaultValue={product.review_count ?? 0} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Variantes */}
            {product.category_id && (
              <div className={sectionCls}>
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                  <h2 className="font-semibold text-[#0F172A]">Variantes</h2>
                  <Link
                    href={`/admin/products/new?category_id=${product.category_id}`}
                    className="flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Nova
                  </Link>
                </div>
                {relatedVariants.length === 0 ? (
                  <div className="p-6 text-center flex flex-col items-center gap-2">
                    <p className="text-xs text-[#94A3B8]">Nenhuma variante nesta categoria.</p>
                    <Link
                      href={`/admin/products/new?category_id=${product.category_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F172A] hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Criar variante
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-2">
                    {relatedVariants.map((v) => (
                      <Link
                        key={v.id}
                        href={`/admin/products/${v.id}/edit`}
                        className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{v.name}</p>
                          <p className="text-xs text-[#64748B]">R$ {Number(v.promo_price).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${v.status === 'active' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                            {v.status === 'active' ? 'Ativo' : 'Rascunho'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0F172A] transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </form>
    </div>
  );
}
