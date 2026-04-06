'use client';

import { useState } from 'react';
import {
  Palette, Phone, Plug, Search, X, Settings, CheckCircle,
  Plus, Trash2, ChevronRight, CreditCard,
} from 'lucide-react';
import type { TenantConfig, TenantIntegration } from '@/types/tenant';
import {
  updateBrandConfig,
  updateContactConfig,
  updateSeoConfig,
  updateCheckoutConfig,
  upsertIntegration,
  type IntegrationProvider,
} from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

type IntegrationRow = Omit<TenantIntegration, 'secret_key_encrypted' | 'tenant_id' | 'extra_config'>;
type Section = 'marca' | 'contato' | 'integracoes' | 'seo' | 'checkout';
type FilterId = 'todos' | 'pagamentos' | 'analytics' | 'instalado';

interface Props {
  config: TenantConfig | null;
  integrations: IntegrationRow[];
}

// ── Sub-nav items ─────────────────────────────────────────────────────────────

const SUB_NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'marca',       label: 'Marca',              icon: Palette },
  { id: 'contato',     label: 'Contato & Conteúdo', icon: Phone },
  { id: 'integracoes', label: 'Integrações',         icon: Plug },
  { id: 'seo',         label: 'SEO',                icon: Search },
  { id: 'checkout',    label: 'Checkout',            icon: CreditCard },
];

// ── Integration catalog ───────────────────────────────────────────────────────

type IntegrationMeta = {
  provider: IntegrationProvider;
  label: string;
  description: string;
  category: 'pagamentos' | 'analytics';
  color: string;
  initials: string;
  pubLabel: string;
  pubPlaceholder: string;
  secretLabel?: string;
  secretPlaceholder?: string;
};

const INTEGRATIONS: IntegrationMeta[] = [
  {
    provider: 'mercadopago',
    label: 'Mercado Pago',
    description: 'Aceite Pix e cartão com suas próprias chaves de API.',
    category: 'pagamentos',
    color: '#009EE3',
    initials: 'MP',
    pubLabel: 'Public Key (APP_USR)',
    pubPlaceholder: 'APP_USR-xxxxxxxx-...',
    secretLabel: 'Access Token',
    secretPlaceholder: 'APP_USR-xxxxxxxx-...',
  },
  {
    provider: 'stripe',
    label: 'Stripe',
    description: 'Pagamentos internacionais com cartão de crédito.',
    category: 'pagamentos',
    color: '#635BFF',
    initials: 'St',
    pubLabel: 'Publishable Key',
    pubPlaceholder: 'pk_live_...',
    secretLabel: 'Secret Key',
    secretPlaceholder: 'sk_live_...',
  },
  {
    provider: 'meta_pixel',
    label: 'Meta Pixel',
    description: 'Rastreie conversões e otimize anúncios no Facebook e Instagram.',
    category: 'analytics',
    color: '#1877F2',
    initials: 'fb',
    pubLabel: 'Pixel ID',
    pubPlaceholder: '1234567890123456',
  },
  {
    provider: 'kwai_pixel',
    label: 'Kwai Pixel',
    description: 'Rastreamento de eventos para campanhas no Kwai.',
    category: 'analytics',
    color: '#FF4D00',
    initials: 'Kw',
    pubLabel: 'Pixel ID',
    pubPlaceholder: 'KWAI-xxxxxxxx',
  },
];

// ── Shared style helpers ──────────────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2.5 border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 bg-white text-[#0F172A] placeholder:text-[#94A3B8]';
const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-1.5';
const saveBtnCls = 'bg-[#0F172A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1e293b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

// ── Root Component ────────────────────────────────────────────────────────────

export default function SettingsTabs({ config, integrations }: Props) {
  const [section, setSection]           = useState<Section>('marca');
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState<{ msg: string; ok: boolean } | null>(null);
  const [openProvider, setOpenProvider] = useState<IntegrationProvider | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (action: (fd: FormData) => Promise<void>, fd: FormData) => {
    setSaving(true);
    try {
      await action(fd);
      showToast('Salvo com sucesso!', true);
    } catch (e) {
      showToast(`Erro: ${e instanceof Error ? e.message : 'Tente novamente'}`, false);
    } finally {
      setSaving(false);
    }
  };

  const openIntegration = INTEGRATIONS.find(i => i.provider === openProvider);
  const existingOpen    = integrations.find(i => i.provider === openProvider);

  return (
    <div className="flex gap-0 relative">

      {/* ── Sub-nav lateral ───────────────────────────────────────────────── */}
      <aside className="w-52 shrink-0 border-r border-[#E2E8F0] pt-1 pr-4">
        <nav className="flex flex-col gap-0.5">
          {SUB_NAV.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-left w-full transition-colors ${
                  active
                    ? 'bg-[#0F172A] text-white'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Conteúdo principal ────────────────────────────────────────────── */}
      <main className="flex-1 pl-8 min-w-0">

        {/* Toast */}
        {toast && (
          <div className={`mb-5 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
            toast.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {toast.ok ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {section === 'marca'       && <BrandSection       config={config}       saving={saving} onSave={handleSave} />}
        {section === 'contato'     && <ContactSection     config={config}       saving={saving} onSave={handleSave} />}
        {section === 'integracoes' && <IntegrationsSection integrations={integrations} onOpen={setOpenProvider} />}
        {section === 'seo'         && <SeoSection         config={config}       saving={saving} onSave={handleSave} />}
        {section === 'checkout'    && <CheckoutSection    config={config}       saving={saving} onSave={handleSave} />}
      </main>

      {/* ── Sheet de configuração da integração ───────────────────────────── */}
      {openProvider && openIntegration && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setOpenProvider(null)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-[#E2E8F0]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ background: openIntegration.color }}
              >
                {openIntegration.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0F172A] text-[15px]">{openIntegration.label}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{openIntegration.description}</p>
              </div>
              <button
                onClick={() => setOpenProvider(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form
                id="integration-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  fd.set('provider', openProvider);
                  handleSave(upsertIntegration, fd).then(() => setOpenProvider(null));
                }}
                className="space-y-5"
              >
                {/* Toggle ativo */}
                <label className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-pointer">
                  <span className="text-sm font-medium text-[#0F172A]">Integração ativa</span>
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    defaultChecked={existingOpen?.is_active ?? true}
                    className="w-4 h-4 accent-emerald-600"
                  />
                </label>

                {/* Public key / Pixel ID */}
                <div>
                  <label className={labelCls}>{openIntegration.pubLabel}</label>
                  <input
                    name="public_key"
                    defaultValue={existingOpen?.public_key ?? ''}
                    className={inputCls}
                    placeholder={openIntegration.pubPlaceholder}
                  />
                </div>

                {/* Secret key (só para MP e Stripe) */}
                {openIntegration.secretLabel && (
                  <div>
                    <label className={labelCls}>{openIntegration.secretLabel}</label>
                    <input
                      name="secret_key"
                      type="password"
                      className={inputCls}
                      placeholder={existingOpen?.public_key ? '(deixe em branco para manter)' : openIntegration.secretPlaceholder}
                    />
                    {existingOpen?.public_key && (
                      <p className="text-xs text-[#94A3B8] mt-1.5">Chave salva. Preencha só para atualizar.</p>
                    )}
                  </div>
                )}

                {existingOpen?.updated_at && (
                  <p className="text-xs text-[#94A3B8]">
                    Última atualização: {new Date(existingOpen.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#E2E8F0] flex gap-3">
              <button
                type="submit"
                form="integration-form"
                disabled={saving}
                className={`${saveBtnCls} flex-1`}
              >
                {saving ? 'Salvando...' : 'Salvar configuração'}
              </button>
              <button
                type="button"
                onClick={() => setOpenProvider(null)}
                className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Seção: Marca ──────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  'Playfair Display', 'DM Sans', 'Inter', 'Roboto', 'Lora',
  'Montserrat', 'Open Sans', 'Merriweather', 'Raleway',
];

function BrandSection({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [primaryColor, setPrimaryColor] = useState(config?.primary_color ?? '#0F172A');
  const [accentColor,  setAccentColor]  = useState(config?.accent_color  ?? '#059669');

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0F172A] mb-1">Identidade Visual</h2>
      <p className="text-sm text-[#64748B] mb-6">Configure o nome e as cores da sua loja.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); onSave(updateBrandConfig, new FormData(e.currentTarget)); }}
        className="space-y-5"
      >
        <div>
          <label className={labelCls}>Nome da Loja</label>
          <input name="brand_name" defaultValue={config?.brand_name ?? ''} className={inputCls} placeholder="Ex: Os Oliveiras" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Cor Primária</label>
            <div className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-xl bg-white">
              <input
                type="color"
                name="primary_color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-8 w-8 rounded-lg border-0 cursor-pointer shrink-0"
              />
              <span className="text-sm text-[#64748B] font-mono">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Cor de Acento</label>
            <div className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-xl bg-white">
              <input
                type="color"
                name="accent_color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-8 w-8 rounded-lg border-0 cursor-pointer shrink-0"
              />
              <span className="text-sm text-[#64748B] font-mono">{accentColor}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Fonte — Títulos</label>
            <select name="font_heading" defaultValue={config?.font_heading ?? 'Playfair Display'} className={inputCls}>
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Fonte — Corpo</label>
            <select name="font_body" defaultValue={config?.font_body ?? 'DM Sans'} className={inputCls}>
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className={saveBtnCls}>
          {saving ? 'Salvando...' : 'Salvar Marca'}
        </button>
      </form>
    </div>
  );
}

// ── Seção: Contato & Conteúdo ─────────────────────────────────────────────────

function ContactSection({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [announcements, setAnnouncements] = useState<string[]>(config?.announcement_messages ?? []);
  const [newMsg, setNewMsg]               = useState('');

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0F172A] mb-1">Contato & Conteúdo</h2>
      <p className="text-sm text-[#64748B] mb-6">Dados de contato e mensagens exibidas na loja.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          fd.set('announcement_messages', JSON.stringify(announcements));
          onSave(updateContactConfig, fd);
        }}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Telefone</label>
            <input name="phone" defaultValue={config?.phone ?? ''} className={inputCls} placeholder="(87) 99999-9944" />
          </div>
          <div>
            <label className={labelCls}>E-mail</label>
            <input name="email" type="email" defaultValue={config?.email ?? ''} className={inputCls} placeholder="contato@loja.com" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Domínio exibido</label>
          <input name="domain_display" defaultValue={config?.domain_display ?? ''} className={inputCls} placeholder="minhaloja.com.br" />
        </div>

        <div>
          <label className={labelCls}>Mensagens da Barra de Anúncio</label>
          <div className="space-y-2 mb-3">
            {announcements.map((msg, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span className="flex-1 text-sm text-[#475569]">{msg}</span>
                <button
                  type="button"
                  onClick={() => setAnnouncements(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-[#94A3B8] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              className={`${inputCls} flex-1`}
              placeholder="Ex: 🚚 Frete grátis acima de R$ 199"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newMsg.trim()) { setAnnouncements(p => [...p, newMsg.trim()]); setNewMsg(''); }
                }
              }}
            />
            <button
              type="button"
              onClick={() => { if (newMsg.trim()) { setAnnouncements(p => [...p, newMsg.trim()]); setNewMsg(''); } }}
              className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </button>
          </div>
        </div>

        <button type="submit" disabled={saving} className={saveBtnCls}>
          {saving ? 'Salvando...' : 'Salvar Contato'}
        </button>
      </form>
    </div>
  );
}

// ── Seção: Integrações ────────────────────────────────────────────────────────

function IntegrationsSection({ integrations, onOpen }: {
  integrations: IntegrationRow[];
  onOpen: (p: IntegrationProvider) => void;
}) {
  const [filter, setFilter] = useState<FilterId>('todos');

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'todos',      label: 'Todos' },
    { id: 'pagamentos', label: 'Pagamentos' },
    { id: 'analytics',  label: 'Analytics' },
    { id: 'instalado',  label: 'Instalado' },
  ];

  const getExisting = (p: IntegrationProvider) => integrations.find(i => i.provider === p);

  const filtered = INTEGRATIONS.filter(i => {
    if (filter === 'todos')      return true;
    if (filter === 'instalado')  return !!getExisting(i.provider);
    return i.category === filter;
  });

  const pagamentos = filtered.filter(i => i.category === 'pagamentos');
  const analytics  = filtered.filter(i => i.category === 'analytics');

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-1">Integrações</h2>
          <p className="text-sm text-[#64748B]">Conecte suas ferramentas de pagamento e rastreamento.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5 mb-7 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
              filter === f.id
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0F172A] hover:text-[#0F172A]'
            }`}
          >
            {f.label}
            {f.id === 'instalado' && (
              <span className="ml-1.5 bg-emerald-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-semibold">
                {integrations.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grupo Pagamentos */}
      {pagamentos.length > 0 && (
        <div className="mb-7">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Pagamentos</p>
          <div className="grid grid-cols-2 gap-4">
            {pagamentos.map(i => (
              <IntegrationCard key={i.provider} meta={i} existing={getExisting(i.provider)} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}

      {/* Grupo Analytics */}
      {analytics.length > 0 && (
        <div className="mb-7">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Analytics & Pixels</p>
          <div className="grid grid-cols-2 gap-4">
            {analytics.map(i => (
              <IntegrationCard key={i.provider} meta={i} existing={getExisting(i.provider)} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#94A3B8] text-sm">
          Nenhuma integração encontrada para este filtro.
        </div>
      )}
    </div>
  );
}

// ── Card de Integração ────────────────────────────────────────────────────────

function IntegrationCard({ meta, existing, onOpen }: {
  meta: IntegrationMeta;
  existing: IntegrationRow | undefined;
  onOpen: (p: IntegrationProvider) => void;
}) {
  const installed = !!existing;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Logo + nome */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: meta.color }}
        >
          {meta.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0F172A] text-[14px] leading-tight">{meta.label}</p>
          <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug line-clamp-2">{meta.description}</p>
        </div>
      </div>

      {/* Rodapé do card */}
      <div className="flex items-center justify-between mt-auto">
        {installed ? (
          <>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              Instalado
            </span>
            <button
              onClick={() => onOpen(meta.provider)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-[12px] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Configurar
            </button>
          </>
        ) : (
          <>
            <span className="text-[12px] text-[#94A3B8]">Não instalado</span>
            <button
              onClick={() => onOpen(meta.provider)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] rounded-lg text-[12px] text-white font-semibold hover:bg-[#1e293b] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Instalar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Seção: Checkout ───────────────────────────────────────────────────────────

function CheckoutSection({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [stripeFallback, setStripeFallback] = useState(config?.checkout_enable_stripe_fallback ?? true);

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0F172A] mb-1">Checkout</h2>
      <p className="text-sm text-[#64748B] mb-6">Configure a retentativa inteligente e os preços do funil.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          fd.set('checkout_enable_stripe_fallback', String(stripeFallback));
          onSave(updateCheckoutConfig, fd);
        }}
        className="space-y-6"
      >
        {/* Retentativa Inteligente */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <p className="text-[13px] font-semibold text-[#0F172A]">Retentativa Inteligente</p>
            <p className="text-xs text-[#64748B] mt-0.5">Se o Mercado Pago recusar, tenta automaticamente pelo Stripe.</p>
          </div>
          <div className="p-5 space-y-5">
            {/* Toggle Stripe fallback */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Ativar Stripe como fallback</p>
                <p className="text-xs text-[#64748B] mt-0.5">Quando desativado, erros de cartão são mostrados imediatamente.</p>
              </div>
              <button
                type="button"
                onClick={() => setStripeFallback(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-4 ${stripeFallback ? 'bg-[#059669]' : 'bg-[#CBD5E1]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${stripeFallback ? 'left-6' : 'left-1'}`} />
              </button>
            </label>

            {stripeFallback && (
              <div>
                <label className={labelCls}>Pausa entre tentativas (ms)</label>
                <input
                  type="number"
                  name="checkout_retry_delay_ms"
                  defaultValue={config?.checkout_retry_delay_ms ?? 900}
                  min={0}
                  max={5000}
                  step={100}
                  className={inputCls}
                />
                <p className="text-xs text-[#94A3B8] mt-1">Tempo de espera antes de tentar o Stripe. Padrão: 900ms.</p>
              </div>
            )}

            <div>
              <label className={labelCls}>Intervalo de verificação PIX (ms)</label>
              <input
                type="number"
                name="checkout_pix_polling_ms"
                defaultValue={config?.checkout_pix_polling_ms ?? 3000}
                min={1000}
                max={10000}
                step={500}
                className={inputCls}
              />
              <p className="text-xs text-[#94A3B8] mt-1">Com que frequência checar se o PIX foi pago. Padrão: 3000ms.</p>
            </div>
          </div>
        </div>

        {/* Preços do Funil */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <p className="text-[13px] font-semibold text-[#0F172A]">Preços do Funil</p>
            <p className="text-xs text-[#64748B] mt-0.5">Valores exibidos e cobrados no checkout e no modal de upsell.</p>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Preço do Upsell (R$)</label>
              <input
                type="number"
                step="0.01"
                name="checkout_upsell_price"
                defaultValue={config?.checkout_upsell_price ?? 69.90}
                min={0}
                className={inputCls}
              />
              <p className="text-xs text-[#94A3B8] mt-1">Exibido no modal pós-compra.</p>
            </div>
            <div>
              <label className={labelCls}>Preço do Order Bump (R$)</label>
              <input
                type="number"
                step="0.01"
                name="checkout_order_bump_price"
                defaultValue={config?.checkout_order_bump_price ?? 29.90}
                min={0}
                className={inputCls}
              />
              <p className="text-xs text-[#94A3B8] mt-1">Exibido na oferta adicional do checkout.</p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className={saveBtnCls}>
          {saving ? 'Salvando...' : 'Salvar Checkout'}
        </button>
      </form>
    </div>
  );
}

// ── Seção: SEO ────────────────────────────────────────────────────────────────

function SeoSection({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [titleLen, setTitleLen]       = useState((config?.seo_title ?? '').length);
  const [descLen,  setDescLen]        = useState((config?.seo_description ?? '').length);

  return (
    <div>
      <h2 className="text-lg font-bold text-[#0F172A] mb-1">SEO & Metadados</h2>
      <p className="text-sm text-[#64748B] mb-6">Como sua loja aparece nos resultados de busca.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); onSave(updateSeoConfig, new FormData(e.currentTarget)); }}
        className="space-y-5"
      >
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelCls} style={{ margin: 0 }}>Título da Página</label>
            <span className={`text-[11px] ${titleLen > 55 ? 'text-amber-500' : 'text-[#94A3B8]'}`}>{titleLen}/60</span>
          </div>
          <input
            name="seo_title"
            defaultValue={config?.seo_title ?? ''}
            className={inputCls}
            placeholder="Loja | Slogan"
            maxLength={60}
            onChange={e => setTitleLen(e.target.value.length)}
          />
          <p className="text-xs text-[#94A3B8] mt-1">Recomendado: até 60 caracteres</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className={labelCls} style={{ margin: 0 }}>Meta Description</label>
            <span className={`text-[11px] ${descLen > 150 ? 'text-amber-500' : 'text-[#94A3B8]'}`}>{descLen}/160</span>
          </div>
          <textarea
            name="seo_description"
            defaultValue={config?.seo_description ?? ''}
            className={`${inputCls} resize-none`}
            rows={4}
            placeholder="Descrição da sua loja para o Google..."
            maxLength={160}
            onChange={e => setDescLen(e.target.value.length)}
          />
          <p className="text-xs text-[#94A3B8] mt-1">Recomendado: até 160 caracteres</p>
        </div>

        {/* Preview Google */}
        <div className="p-4 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">Preview no Google</p>
          <p className="text-[#1a0dab] text-[15px] font-medium truncate">
            {config?.seo_title || 'Título da Página'}
          </p>
          <p className="text-[#006621] text-[12px] mt-0.5">{config?.domain_display || 'minhaloja.com.br'}</p>
          <p className="text-[#545454] text-[13px] mt-1 line-clamp-2">
            {config?.seo_description || 'Descrição da página aparece aqui...'}
          </p>
        </div>

        <button type="submit" disabled={saving} className={saveBtnCls}>
          {saving ? 'Salvando...' : 'Salvar SEO'}
        </button>
      </form>
    </div>
  );
}
