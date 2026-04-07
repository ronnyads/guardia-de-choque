'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Tablet, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { updateBrandConfig } from '@/app/admin/settings/actions';

// ── Presets ────────────────────────────────────────────────────────────────────

const PRESETS = [
  { name: 'Onyx',     primary: '#09090B', accent: '#16A34A' },
  { name: 'Navy',     primary: '#0F172A', accent: '#059669' },
  { name: 'Rosa',     primary: '#BE185D', accent: '#DB2777' },
  { name: 'Vinho',    primary: '#7F1D1D', accent: '#DC2626' },
  { name: 'Ardósia',  primary: '#1E293B', accent: '#0EA5E9' },
];

const FONTS = [
  'Playfair Display', 'DM Sans', 'Inter', 'Roboto', 'Lora',
  'Montserrat', 'Open Sans', 'Merriweather', 'Raleway',
];

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
};

const inputCls = 'border border-[#CBD5E1] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A] w-full bg-white transition-colors';
const labelCls = 'block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider';

// ── Component ──────────────────────────────────────────────────────────────────

export default function ThemeEditorPage() {
  const [primary,     setPrimary]     = useState('#09090B');
  const [accent,      setAccent]      = useState('#16A34A');
  const [fontHeading, setFontHeading] = useState('Playfair Display');
  const [fontBody,    setFontBody]    = useState('DM Sans');
  const [brandName,   setBrandName]   = useState('');
  const [viewport,    setViewport]    = useState<Viewport>('desktop');
  const [publishing,  setPublishing]  = useState(false);
  const [published,   setPublished]   = useState(false);
  const [iframeKey,   setIframeKey]   = useState(0);
  const [iframeReady, setIframeReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch current config on mount
  useEffect(() => {
    fetch('/api/admin/theme-config')
      .then(r => r.json())
      .then(d => {
        if (d.primary_color)  setPrimary(d.primary_color);
        if (d.accent_color)   setAccent(d.accent_color);
        if (d.font_heading)   setFontHeading(d.font_heading);
        if (d.font_body)      setFontBody(d.font_body);
        if (d.brand_name)     setBrandName(d.brand_name);
      })
      .catch(() => {});
  }, []);

  // Send theme update to iframe
  const pushTheme = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({
      type: 'THEME_UPDATE',
      vars: {
        '--store-primary':      primary,
        '--store-accent':       accent,
        '--store-font-heading': `'${fontHeading}', serif`,
        '--store-font-body':    `'${fontBody}', sans-serif`,
      },
    }, '*');
  }, [primary, accent, fontHeading, fontBody]);

  // Push on every change
  useEffect(() => {
    if (iframeReady) pushTheme();
  }, [primary, accent, fontHeading, fontBody, iframeReady, pushTheme]);

  const handleIframeLoad = () => {
    setIframeReady(true);
    setTimeout(pushTheme, 100);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setPrimary(p.primary);
    setAccent(p.accent);
  };

  const publish = async () => {
    setPublishing(true);
    try {
      const fd = new FormData();
      fd.set('primary_color', primary);
      fd.set('accent_color', accent);
      fd.set('font_heading', fontHeading);
      fd.set('font_body', fontBody);
      if (brandName) fd.set('brand_name', brandName);
      await updateBrandConfig(fd);
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
    } catch (e) {
      alert('Erro ao publicar: ' + (e instanceof Error ? e.message : 'Tente novamente'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#64748B]" />
          </Link>
          <div>
            <p className="font-semibold text-[#0F172A] text-sm">Editor de Tema</p>
            <p className="text-xs text-[#94A3B8]">Alterações ao vivo — publique para salvar</p>
          </div>
        </div>

        {/* Viewport toggle */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-xl p-1">
          {([
            { id: 'desktop', icon: Monitor },
            { id: 'tablet',  icon: Tablet },
            { id: 'mobile',  icon: Smartphone },
          ] as { id: Viewport; icon: React.ElementType }[]).map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewport(id)}
              className={`p-1.5 rounded-lg transition-colors ${viewport === id ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#94A3B8] hover:text-[#0F172A]'}`}
              title={id}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Publish button */}
        <button
          onClick={publish}
          disabled={publishing}
          className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
        >
          {publishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : published ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : null}
          {published ? 'Publicado!' : publishing ? 'Publicando...' : 'Publicar'}
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar de controles ──────────────────────────────── */}
        <aside className="w-72 bg-white border-r border-[#E2E8F0] overflow-y-auto shrink-0 flex flex-col gap-0">

          {/* Presets */}
          <div className="p-5 border-b border-[#F1F5F9]">
            <p className={labelCls}>Presets</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {PRESETS.map(p => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  title={p.name}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all hover:border-[#0F172A] ${primary === p.primary ? 'border-[#0F172A]' : 'border-[#E2E8F0]'}`}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ background: p.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ background: p.accent }} />
                  </div>
                  <span className="text-[10px] font-medium text-[#64748B]">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="p-5 border-b border-[#F1F5F9]">
            <p className={labelCls}>Cores</p>
            <div className="flex flex-col gap-3 mt-2">
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Cor Principal</label>
                <div className="flex items-center gap-2 p-2 border border-[#E2E8F0] rounded-lg bg-white">
                  <input
                    type="color"
                    value={primary}
                    onChange={e => setPrimary(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer shrink-0"
                  />
                  <span className="text-xs font-mono text-[#475569]">{primary}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Cor de Destaque</label>
                <div className="flex items-center gap-2 p-2 border border-[#E2E8F0] rounded-lg bg-white">
                  <input
                    type="color"
                    value={accent}
                    onChange={e => setAccent(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer shrink-0"
                  />
                  <span className="text-xs font-mono text-[#475569]">{accent}</span>
                </div>
              </div>
            </div>

            {/* Live preview swatches */}
            <div className="mt-4 p-3 bg-[#F8FAFC] rounded-xl flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Preview</p>
              <div className="flex gap-2">
                <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold" style={{ background: primary }}>
                  Principal
                </div>
                <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold" style={{ background: accent }}>
                  Destaque
                </div>
              </div>
            </div>
          </div>

          {/* Tipografia */}
          <div className="p-5 border-b border-[#F1F5F9]">
            <p className={labelCls}>Tipografia</p>
            <div className="flex flex-col gap-3 mt-2">
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Fonte — Títulos</label>
                <select value={fontHeading} onChange={e => setFontHeading(e.target.value)} className={inputCls}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Fonte — Corpo</label>
                <select value={fontBody} onChange={e => setFontBody(e.target.value)} className={inputCls}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Loja */}
          <div className="p-5 border-b border-[#F1F5F9]">
            <p className={labelCls}>Loja</p>
            <div className="mt-2">
              <label className="text-xs text-[#64748B] mb-1 block">Nome da Loja</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className={inputCls}
                placeholder="Ex: Guardiã de Choque"
              />
            </div>
          </div>

          {/* Reload preview */}
          <div className="p-5">
            <button
              onClick={() => { setIframeReady(false); setIframeKey(k => k + 1); }}
              className="w-full py-2 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] transition-colors"
            >
              Recarregar preview
            </button>
          </div>
        </aside>

        {/* ── Preview iframe ────────────────────────────────────── */}
        <div className="flex-1 bg-[#E2E8F0] overflow-auto flex items-start justify-center p-4">
          <div
            className="bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 h-full"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              minWidth: viewport === 'desktop' ? '800px' : undefined,
              maxWidth: '100%',
            }}
          >
            {!iframeReady && (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
              </div>
            )}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src="/"
              className="w-full border-0"
              style={{
                height: 'calc(100vh - 120px)',
                display: iframeReady ? 'block' : 'none',
              }}
              onLoad={handleIframeLoad}
              title="Preview da loja"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
