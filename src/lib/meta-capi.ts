import { createHash } from 'crypto';

function sha256(str: string): string {
  return createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
}

function hashPhone(phone: string): string {
  return createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');
}

interface CapiBaseOpts {
  pixelId:     string;
  accessToken: string;
  email?:      string | null;
  phone?:      string | null;
  eventId:     string;
  clientIp?:   string | null;
  clientAgent?: string | null;
  fbp?:        string | null;
  fbc?:        string | null;
}

interface CapiPurchaseOpts extends CapiBaseOpts {
  value:    number;
  currency?: string;
  contentName?: string;
}

interface CapiEventOpts extends CapiBaseOpts {
  eventName:   string;
  value?:      number;
  currency?:   string;
  contentName?: string;
  contentIds?:  string[];
  contentType?: string;
}

async function sendCapiEvent(opts: CapiEventOpts): Promise<void> {
  if (!opts.pixelId || !opts.accessToken) return;

  const userData: Record<string, string | object> = {};
  if (opts.email) userData.em = sha256(opts.email);
  if (opts.phone) userData.ph = hashPhone(opts.phone);
  if (opts.fbp)   userData.fbp = opts.fbp;
  if (opts.fbc)   userData.fbc = opts.fbc;
  if (opts.clientIp)    userData.client_ip_address  = opts.clientIp;
  if (opts.clientAgent) userData.client_user_agent  = opts.clientAgent;

  const customData: Record<string, unknown> = {};
  if (opts.value    !== undefined) customData.value    = opts.value;
  if (opts.currency !== undefined) customData.currency = opts.currency ?? 'BRL';
  if (opts.contentName) customData.content_name = opts.contentName;
  if (opts.contentIds)  customData.content_ids  = opts.contentIds;
  if (opts.contentType) customData.content_type = opts.contentType ?? 'product';

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${opts.pixelId}/events?access_token=${opts.accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name:    opts.eventName,
            event_time:    Math.floor(Date.now() / 1000),
            event_id:      opts.eventId,
            action_source: 'website',
            user_data:     userData,
            custom_data:   customData,
          }],
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[CAPI] Erro ao enviar ${opts.eventName}:`, res.status, body);
    }
  } catch (e) {
    console.error(`[CAPI] Exceção ao enviar ${opts.eventName}:`, e);
  }
}

// ─── Eventos públicos ────────────────────────────────────────────────────────

export async function sendCapiPurchase(opts: CapiPurchaseOpts): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'Purchase', currency: opts.currency ?? 'BRL' });
}

export async function sendCapiViewContent(opts: CapiBaseOpts & {
  value?: number;
  contentName?: string;
  contentIds?:  string[];
}): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'ViewContent', currency: 'BRL', contentType: 'product' });
}

export async function sendCapiInitiateCheckout(opts: CapiBaseOpts & {
  value?: number;
  contentName?: string;
}): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'InitiateCheckout', currency: 'BRL' });
}

export async function sendCapiAddToCart(opts: CapiBaseOpts & {
  value?: number;
  contentName?: string;
  contentIds?:  string[];
}): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'AddToCart', currency: 'BRL', contentType: 'product' });
}

export async function sendCapiLead(opts: CapiBaseOpts & {
  contentName?: string;
}): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'Lead' });
}

export async function sendCapiAddPaymentInfo(opts: CapiBaseOpts & {
  value?: number;
  contentName?: string;
}): Promise<void> {
  return sendCapiEvent({ ...opts, eventName: 'AddPaymentInfo', currency: 'BRL' });
}
