'use client';

import { useState, useRef } from 'react';
import { Save, ArrowRight, Plus, X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import RichTextEditor from './RichTextEditor';
import FeaturesEditor from './FeaturesEditor';
import SpecsEditor from './SpecsEditor';

// ── Types ──────────────────────────────────────────────────────────────────────

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  images: string[] | null;
  original_price: number;
  promo_price: number;
  cost_price: number | null;
  sku: string | null;
  inventory_count: number | null;
  category_id: string | null;
  badge: string | null;
  features: { icon: string; title: string; description: string }[] | null;
  specs: { label: string; value: string }[] | null;
  rating: number | null;
  review_count: number | null;
  status: string;
  bump_label: string | null;
  bump_price: number | null;
  upsell_label: string | null;
  upsell_price: number | null;
  downsell_label: string | null;
  downsell_price: number | null;
}

interface RelatedVariant {
  id: string;
  name: string;
  promo_price: number;
  status: string;
}

interface Props {
  product: DbProduct | null;
  relatedVariants: RelatedVariant[];
  updateAction: (fd: FormData) => Promise<void>;
  createAction: (fd: FormData) => Promise<void>;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] w-full bg-white transition-colors';
const labelCls = 'block text-sm font-medium text-[#374151] mb-1.5';
const sectionCls = 'bg-white rounded-xl border border-[#E2E8F0] shadow-sm';

// ── Modal rápido de nova variante ─────────────────────────────────────────────

function NewVariantModal({
  categoryId,
  onCreated,
  onClose,
}: {
  categoryId: string;
  onCreated: (v: RelatedVariant) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [status, setStatus] = useState('active');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleName = (v: string) => {
    setName(v);
    if (!slugManual) setSlug(toSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !promoPrice) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, promo_price: promoPrice, original_price: originalPrice || promoPrice, category_id: categoryId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data.variant);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A]">Nova Variante</h3>
          <button type="button" onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Nome *</label>
            <input value={name} onChange={e => handleName(e.target.value)} className={inputCls} placeholder="Ex: Kit Dupla" required />
          </div>
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <input
              value={slug}
              onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
              className={inputCls}
              placeholder="kit-dupla"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Preço De (R$)</label>
              <input type="number" step="0.01" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} className={inputCls} placeholder="0,00" />
            </div>
            <div>
              <label className={labelCls}>Preço Por (R$) *</label>
              <input type="number" step="0.01" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} className={inputCls} placeholder="0,00" required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
              <option value="active">✓ Ativo</option>
              <option value="draft">◦ Rascunho</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="flex-1 bg-[#0F172A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1E293B] transition-colors disabled:opacity-60">
              {saving ? 'Criando...' : 'Criar Variante'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ProductEditForm({ product, relatedVariants: initialVariants, updateAction, createAction }: Props) {
  const isEdit = product !== null;

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugManual, setSlugManual] = useState(isEdit);
  const [promoPrice, setPromoPrice] = useState(product?.promo_price?.toString() ?? '');
  const [costPrice, setCostPrice] = useState(product?.cost_price?.toString() ?? '');
  const [variants, setVariants] = useState<RelatedVariant[]>(initialVariants);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const margin = promoPrice && costPrice
    ? Math.round(((parseFloat(promoPrice) - parseFloat(costPrice)) / parseFloat(promoPrice)) * 100)
    : null;

  const handleName = (v: string) => {
    setName(v);
    if (!slugManual) setSlug(toSlug(v));
  };

  const handleVariantCreated = (v: RelatedVariant) => {
    setVariants(prev => [...prev, v]);
  };

  const categoryId = product?.category_id ?? '';

  return (
    <>
      <form ref={formRef} action={isEdit ? updateAction : createAction} id="product-form">
        {isEdit && <input type="hidden" name="id" value={product.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Coluna principal (2/3) ─────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Informações básicas */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Informações Básicas</h2>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Título do Produto</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={name}
                    onChange={e => handleName(e.target.value)}
                    className={inputCls}
                    placeholder="Ex: Guardiã de Choque Premium"
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    value={slug}
                    onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
                    className={inputCls}
                    placeholder="guardia-de-choque"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">guardiadechoque.online/produto/<strong>{slug || '...'}</strong></p>
                </div>
                <div>
                  <label className={labelCls}>Descrição Curta</label>
                  <textarea rows={3} name="description" defaultValue={product?.description ?? ''} className={inputCls} placeholder="Aparece nos cards e nas buscas..." />
                </div>
              </div>
            </div>

            {/* Descrição Longa (Rich Text) */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Descrição Longa</h2>
              </div>
              <div className="p-6">
                <RichTextEditor
                  defaultValue={product?.long_description ?? ''}
                  name="long_description"
                  placeholder="Descrição completa exibida na página do produto..."
                />
              </div>
            </div>

            {/* Imagens */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Imagens</h2>
              </div>
              <div className="p-6">
                <ImageUploader initialImages={product?.images ?? []} name="images" />
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
                    <input type="number" step="0.01" name="original_price" defaultValue={product?.original_price} className={inputCls} placeholder="0,00" />
                  </div>
                  <div>
                    <label className={labelCls}>Preço Por (R$) <span className="text-[#94A3B8] font-normal">— venda</span></label>
                    <input required type="number" step="0.01" name="promo_price" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} className={inputCls} placeholder="0,00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Custo do Produto (R$)</label>
                    <input type="number" step="0.01" name="cost_price" value={costPrice} onChange={e => setCostPrice(e.target.value)} className={inputCls} placeholder="0,00" />
                    <p className="text-xs text-[#94A3B8] mt-1">Não aparece para o cliente.</p>
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
              <div className="p-6 flex flex-col gap-6">
                <div>
                  <label className={labelCls}>Features</label>
                  <p className="text-xs text-[#94A3B8] mb-3">Ícone + título + descrição de cada benefício do produto.</p>
                  <FeaturesEditor defaultValue={product?.features ?? []} name="features" />
                </div>
                <div className="border-t border-[#F1F5F9] pt-6">
                  <label className={labelCls}>Especificações Técnicas</label>
                  <p className="text-xs text-[#94A3B8] mb-3">Ex: Peso, Dimensões, Material...</p>
                  <SpecsEditor defaultValue={product?.specs ?? []} name="specs" />
                </div>
              </div>
            </div>

          </div>

          {/* ── Coluna lateral (1/3) ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Status */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Status</h2>
              </div>
              <div className="p-6">
                <select name="status" defaultValue={product?.status ?? 'active'} className={inputCls}>
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
                  <input type="text" name="category_id" defaultValue={product?.category_id ?? ''} className={inputCls} placeholder="defesa-pessoal" />
                </div>
                <div>
                  <label className={labelCls}>Badge</label>
                  <select name="badge" defaultValue={product?.badge ?? ''} className={inputCls}>
                    <option value="">Sem badge</option>
                    <option value="Mais Vendido">Mais Vendido</option>
                    <option value="Kit">Kit</option>
                    <option value="Oferta">Oferta</option>
                    <option value="Novo">Novo</option>
                  </select>
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
                  <input type="text" name="sku" defaultValue={product?.sku ?? ''} className={inputCls} placeholder="PROD-001" />
                </div>
                <div>
                  <label className={labelCls}>Quantidade em estoque</label>
                  <input type="number" name="inventory_count" defaultValue={product?.inventory_count ?? 0} className={inputCls} min="0" />
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
                  <input type="number" step="0.1" min="0" max="5" name="rating" defaultValue={product?.rating ?? 0} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Total de avaliações</label>
                  <input type="number" min="0" name="review_count" defaultValue={product?.review_count ?? 0} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Variantes */}
            {(isEdit && product.category_id) && (
              <div className={sectionCls}>
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                  <h2 className="font-semibold text-[#0F172A]">Variantes</h2>
                  <button
                    type="button"
                    onClick={() => setShowVariantModal(true)}
                    className="flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Nova
                  </button>
                </div>

                {variants.length === 0 ? (
                  <div className="p-6 text-center flex flex-col items-center gap-2">
                    <p className="text-xs text-[#94A3B8]">Nenhuma variante nesta categoria.</p>
                    <button
                      type="button"
                      onClick={() => setShowVariantModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F172A] hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      Criar variante
                    </button>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col gap-2">
                    {variants.map((v) => (
                      <a
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
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Funil de Vendas */}
            <div className={sectionCls}>
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <h2 className="font-semibold text-[#0F172A]">Funil de Vendas</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Order Bump, Upsell e Downsell aparecem no checkout.</p>
              </div>
              <div className="p-6 flex flex-col gap-5">

                {/* Order Bump */}
                <div>
                  <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide mb-2">Order Bump</p>
                  <p className="text-xs text-[#94A3B8] mb-3">Oferta exibida antes do pagamento (ex: garantia estendida).</p>
                  <div className="flex flex-col gap-2">
                    <input type="text" name="bump_label" defaultValue={product?.bump_label ?? ''} className={inputCls} placeholder="Ex: Garantia Premium 1 ano" />
                    <input type="number" step="0.01" min="0" name="bump_price" defaultValue={product?.bump_price ?? ''} className={inputCls} placeholder="Preço R$" />
                  </div>
                </div>

                <div className="border-t border-[#F1F5F9]" />

                {/* Upsell */}
                <div>
                  <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide mb-2">Upsell</p>
                  <p className="text-xs text-[#94A3B8] mb-3">Modal exibido após o pagamento (ex: produto complementar).</p>
                  <div className="flex flex-col gap-2">
                    <input type="text" name="upsell_label" defaultValue={product?.upsell_label ?? ''} className={inputCls} placeholder="Ex: Mini Taser 12.000KV" />
                    <input type="number" step="0.01" min="0" name="upsell_price" defaultValue={product?.upsell_price ?? ''} className={inputCls} placeholder="Preço R$" />
                  </div>
                </div>

                <div className="border-t border-[#F1F5F9]" />

                {/* Downsell */}
                <div>
                  <p className="text-xs font-semibold text-[#0F172A] uppercase tracking-wide mb-2">Downsell</p>
                  <p className="text-xs text-[#94A3B8] mb-3">Oferta alternativa se o upsell for recusado.</p>
                  <div className="flex flex-col gap-2">
                    <input type="text" name="downsell_label" defaultValue={product?.downsell_label ?? ''} className={inputCls} placeholder="Ex: Proteção Básica" />
                    <input type="number" step="0.01" min="0" name="downsell_price" defaultValue={product?.downsell_price ?? ''} className={inputCls} placeholder="Preço R$" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </form>

      {showVariantModal && categoryId && (
        <NewVariantModal
          categoryId={categoryId}
          onCreated={handleVariantCreated}
          onClose={() => setShowVariantModal(false)}
        />
      )}
    </>
  );
}
