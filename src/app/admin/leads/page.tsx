import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';
import { Users, ShoppingCart, TrendingUp, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

function fmtDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function fmt(v: number) {
  return v.toFixed(2).replace('.', ',');
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  checkout_started: { label: 'Abandonado',  cls: 'bg-[#FEF9C3] text-[#854D0E]' },
  converted:        { label: 'Convertido',  cls: 'bg-[#DCFCE7] text-[#166534]' },
  recovered:        { label: 'Recuperado',  cls: 'bg-[#DBEAFE] text-[#1E40AF]' },
};

function buildWhatsAppLink(phone: string, name: string, product: string, template: string, slug: string) {
  const clean = phone.replace(/\D/g, '');
  const number = clean.startsWith('55') ? clean : `55${clean}`;
  const link = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://guardiadechoque.online'}/checkout?kit=${slug}`;
  const msg = template
    .replace('{name', name || 'cliente')
    .replace('}', '')
    .replace('{product}', product || 'nosso produto')
    .replace('{link}', link);
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export default async function AdminLeads() {
  const { tenantId } = await requireTenant();
  const supabase = await createServerSupabase();

  const [{ data: leads }, { data: config }] = await Promise.all([
    supabase
      .from('leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('tenant_config')
      .select('recovery_whatsapp_template')
      .eq('tenant_id', tenantId)
      .single(),
  ]);

  const leadList = leads ?? [];
  const template = (config as { recovery_whatsapp_template?: string } | null)?.recovery_whatsapp_template
    ?? 'Olá {name}! Vi que você ficou interessado(a) na {product}. Podemos ajudar? Acesse: {link}';

  const total      = leadList.length;
  const abandoned  = leadList.filter(l => l.status === 'checkout_started').length;
  const converted  = leadList.filter(l => l.status === 'converted').length;
  const recovered  = leadList.filter(l => l.status === 'recovered').length;
  const convRate   = total > 0 ? ((converted + recovered) / total * 100).toFixed(1) : '0';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Leads & Recuperação</h1>
        <p className="text-[#64748B] text-sm">Gerencie contatos e recupere vendas perdidas via WhatsApp.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users,         label: 'Total de Leads',   value: total,    color: 'text-[#0F172A]' },
          { icon: ShoppingCart,  label: 'Abandonados',      value: abandoned, color: 'text-[#D97706]' },
          { icon: MessageCircle, label: 'Recuperados',      value: recovered, color: 'text-[#2563EB]' },
          { icon: TrendingUp,    label: 'Taxa de Conversão',value: `${convRate}%`, color: 'text-[#059669]' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-xs text-[#64748B] font-medium">{kpi.label}</span>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden">
        {leadList.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-[#CBD5E1]" />
            </div>
            <div>
              <h3 className="text-[#0F172A] font-semibold text-lg">Nenhum lead ainda</h3>
              <p className="text-[#64748B] text-sm mt-1 max-w-xs mx-auto">
                Assim que alguém iniciar o checkout e preencher nome, email e telefone, aparecerá aqui.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Lead</th>
                  <th className="px-6 py-3.5">Produto</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Valor</th>
                  <th className="px-6 py-3.5">Data</th>
                  <th className="px-6 py-3.5">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {leadList.map((lead) => {
                  const status = STATUS_MAP[lead.status] ?? { label: lead.status, cls: 'bg-[#F1F5F9] text-[#475569]' };
                  const isAbandoned = lead.status === 'checkout_started';
                  const waLink = lead.customer_phone
                    ? buildWhatsAppLink(
                        lead.customer_phone,
                        lead.customer_name ?? '',
                        lead.product_name  ?? '',
                        template,
                        lead.product_slug  ?? '',
                      )
                    : null;

                  return (
                    <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#0F172A]">{lead.customer_name ?? '—'}</div>
                        <div className="text-xs text-[#94A3B8]">{lead.customer_email ?? ''}</div>
                        <div className="text-xs text-[#94A3B8]">{lead.customer_phone ?? ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {lead.product_name ?? lead.product_slug ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0F172A] tabular-nums">
                        {lead.product_price != null ? `R$ ${fmt(Number(lead.product_price))}` : '—'}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#64748B]">
                        {lead.created_at ? fmtDate(lead.created_at) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {isAbandoned && waLink ? (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            WhatsApp
                          </a>
                        ) : (
                          <span className="text-xs text-[#CBD5E1]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
