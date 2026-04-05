'use client';

import { useState } from 'react';
import type { TenantConfig, TenantIntegration } from '@/types/tenant';
import {
  updateBrandConfig,
  updateContactConfig,
  updateSeoConfig,
  upsertIntegration,
  type IntegrationProvider,
} from './actions';

type IntegrationRow = Omit<TenantIntegration, 'secret_key_encrypted' | 'tenant_id' | 'extra_config'>;

interface Props {
  config: TenantConfig | null;
  integrations: IntegrationRow[];
}

const TABS = [
  { id: 'marca',        label: 'Marca' },
  { id: 'contato',      label: 'Contato & Conteúdo' },
  { id: 'integracoes',  label: 'Integrações' },
  { id: 'seo',          label: 'SEO' },
] as const;

type TabId = typeof TABS[number]['id'];

// ── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 bg-white';
const labelCls = 'block text-sm font-medium text-[#475569] mb-1';
const saveBtnCls = 'bg-[#0F172A] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#1e293b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const cardCls = 'bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm';

// ── Main Component ────────────────────────────────────────────────────────────

export default function SettingsTabs({ config, integrations }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('marca');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = async (action: (fd: FormData) => Promise<void>, fd: FormData) => {
    setSaving(true);
    setSaved(null);
    try {
      await action(fd);
      setSaved('Salvo com sucesso!');
    } catch (e) {
      setSaved(`Erro: ${e instanceof Error ? e.message : 'Tente novamente'}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(null), 3000);
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-[#E2E8F0]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[#0F172A] text-[#0F172A]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toast */}
      {saved && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
          saved.startsWith('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {saved}
        </div>
      )}

      {/* ── ABA MARCA ──────────────────────────────────────────────────────── */}
      {activeTab === 'marca' && (
        <BrandTab config={config} saving={saving} onSave={handleSave} />
      )}

      {/* ── ABA CONTATO ────────────────────────────────────────────────────── */}
      {activeTab === 'contato' && (
        <ContactTab config={config} saving={saving} onSave={handleSave} />
      )}

      {/* ── ABA INTEGRAÇÕES ────────────────────────────────────────────────── */}
      {activeTab === 'integracoes' && (
        <IntegrationsTab integrations={integrations} saving={saving} onSave={handleSave} />
      )}

      {/* ── ABA SEO ────────────────────────────────────────────────────────── */}
      {activeTab === 'seo' && (
        <SeoTab config={config} saving={saving} onSave={handleSave} />
      )}
    </div>
  );
}

// ── Aba Marca ─────────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  'Playfair Display', 'DM Sans', 'Inter', 'Roboto', 'Lora',
  'Montserrat', 'Open Sans', 'Merriweather', 'Raleway',
];

function BrandTab({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [primaryColor, setPrimaryColor] = useState(config?.primary_color ?? '#0F172A');
  const [accentColor, setAccentColor] = useState(config?.accent_color ?? '#059669');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(updateBrandConfig, new FormData(e.currentTarget));
  };

  return (
    <div className={cardCls}>
      <h2 className="text-base font-semibold text-[#0F172A] mb-5">Identidade Visual</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>Nome da Loja</label>
          <input name="brand_name" defaultValue={config?.brand_name ?? ''} className={inputCls} placeholder="Ex: Os Oliveiras" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Cor Primária</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="primary_color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-12 rounded border border-[#E2E8F0] cursor-pointer"
              />
              <span className="text-sm text-[#64748B]">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Cor de Acento</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="accent_color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-12 rounded border border-[#E2E8F0] cursor-pointer"
              />
              <span className="text-sm text-[#64748B]">{accentColor}</span>
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

        <div className="pt-2">
          <button type="submit" disabled={saving} className={saveBtnCls}>
            {saving ? 'Salvando...' : 'Salvar Marca'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Aba Contato & Conteúdo ────────────────────────────────────────────────────

function ContactTab({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const [announcements, setAnnouncements] = useState<string[]>(config?.announcement_messages ?? []);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('announcement_messages', JSON.stringify(announcements));
    onSave(updateContactConfig, fd);
  };

  return (
    <div className="space-y-5">
      <div className={cardCls}>
        <h2 className="text-base font-semibold text-[#0F172A] mb-5">Contato & Conteúdo</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Announcement Messages */}
          <div>
            <label className={labelCls}>Mensagens da Barra de Anúncio</label>
            <div className="space-y-2 mb-2">
              {announcements.map((msg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 text-sm px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">{msg}</span>
                  <button
                    type="button"
                    onClick={() => setAnnouncements(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 text-xs px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newAnnouncement}
                onChange={e => setNewAnnouncement(e.target.value)}
                className={`${inputCls} flex-1`}
                placeholder="Ex: Frete gratis acima de R$ 199"
              />
              <button
                type="button"
                onClick={() => {
                  if (newAnnouncement.trim()) {
                    setAnnouncements(prev => [...prev, newAnnouncement.trim()]);
                    setNewAnnouncement('');
                  }
                }}
                className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#475569] hover:bg-[#F8FAFC]"
              >
                + Adicionar
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className={saveBtnCls}>
              {saving ? 'Salvando...' : 'Salvar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Aba Integracoes ───────────────────────────────────────────────────────────

const INTEGRATIONS_META = [
  { provider: 'mercadopago' as IntegrationProvider, label: 'Mercado Pago', pubLabel: 'Public Key', secretLabel: 'Access Token', placeholder_pub: 'APP_USR-...', placeholder_secret: 'APP_USR-...' },
  { provider: 'stripe' as IntegrationProvider, label: 'Stripe', pubLabel: 'Publishable Key', secretLabel: 'Secret Key', placeholder_pub: 'pk_live_...', placeholder_secret: 'sk_live_...' },
  { provider: 'meta_pixel' as IntegrationProvider, label: 'Meta Pixel (Facebook)', pubLabel: 'Pixel ID', secretLabel: '', placeholder_pub: '1234567890', placeholder_secret: '' },
  { provider: 'kwai_pixel' as IntegrationProvider, label: 'Kwai Pixel', pubLabel: 'Pixel ID', secretLabel: '', placeholder_pub: 'KWAI-...', placeholder_secret: '' },
];

function IntegrationsTab({ integrations, saving, onSave }: {
  integrations: IntegrationRow[];
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const getIntegration = (provider: IntegrationProvider) =>
    integrations.find(i => i.provider === provider);

  const handleSubmit = (provider: IntegrationProvider, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('provider', provider);
    onSave(upsertIntegration, fd);
  };

  return (
    <div className="space-y-4">
      {INTEGRATIONS_META.map(({ provider, label, pubLabel, secretLabel, placeholder_pub, placeholder_secret }) => {
        const existing = getIntegration(provider);
        return (
          <div key={provider} className={cardCls}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#0F172A]">{label}</h2>
              {existing?.updated_at && (
                <span className="text-xs text-[#94A3B8]">
                  Atualizado {new Date(existing.updated_at).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
            <form onSubmit={(e) => handleSubmit(provider, e)} className="space-y-3">
              <div>
                <label className={labelCls}>{pubLabel}</label>
                <input
                  name="public_key"
                  defaultValue={existing?.public_key ?? ''}
                  className={inputCls}
                  placeholder={placeholder_pub}
                />
              </div>
              {secretLabel && (
                <div>
                  <label className={labelCls}>{secretLabel}</label>
                  <input
                    name="secret_key"
                    type="password"
                    className={inputCls}
                    placeholder={existing?.public_key ? '  (deixe em branco para manter)' : placeholder_secret}
                  />
                  {existing?.public_key && (
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Chave salva. Preencha apenas para atualizar.
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={saving} className={saveBtnCls}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <label className="flex items-center gap-2 text-sm text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    defaultChecked={existing?.is_active ?? true}
                    className="rounded"
                  />
                  Ativo
                </label>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
}

// ── Aba SEO ───────────────────────────────────────────────────────────────────

function SeoTab({ config, saving, onSave }: {
  config: TenantConfig | null;
  saving: boolean;
  onSave: (action: (fd: FormData) => Promise<void>, fd: FormData) => Promise<void>;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(updateSeoConfig, new FormData(e.currentTarget));
  };

  return (
    <div className={cardCls}>
      <h2 className="text-base font-semibold text-[#0F172A] mb-5">SEO & Metadados</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>Titulo da Pagina (meta title)</label>
          <input name="seo_title" defaultValue={config?.seo_title ?? ''} className={inputCls} placeholder="Loja | Slogan" maxLength={60} />
          <p className="text-xs text-[#94A3B8] mt-1">Recomendado: ate 60 caracteres</p>
        </div>
        <div>
          <label className={labelCls}>Descricao (meta description)</label>
          <textarea name="seo_description" defaultValue={config?.seo_description ?? ''} className={`${inputCls} resize-none`} rows={3} placeholder="Descricao da sua loja para o Google..." maxLength={160} />
          <p className="text-xs text-[#94A3B8] mt-1">Recomendado: ate 160 caracteres</p>
        </div>
        <div className="pt-2">
          <button type="submit" disabled={saving} className={saveBtnCls}>
            {saving ? 'Salvando...' : 'Salvar SEO'}
          </button>
        </div>
      </form>
    </div>
  );
}
