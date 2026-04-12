import { createHash } from 'crypto';

function sha256(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}

export async function sendCapiPurchase(opts: {
  pixelId: string;
  accessToken: string;
  email?: string | null;
  phone?: string | null;
  value: number;
  currency?: string;
  eventId: string;
}): Promise<void> {
  if (!opts.pixelId || !opts.accessToken) return;

  const userData: Record<string, string> = {};
  if (opts.email) userData.em = sha256(opts.email.trim().toLowerCase());
  if (opts.phone) userData.ph = sha256(opts.phone.replace(/\D/g, ''));

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${opts.pixelId}/events?access_token=${opts.accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name:    'Purchase',
            event_time:    Math.floor(Date.now() / 1000),
            event_id:      opts.eventId,
            action_source: 'website',
            user_data:     userData,
            custom_data: {
              value:    opts.value,
              currency: opts.currency ?? 'BRL',
            },
          }],
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error('[CAPI] Erro ao enviar Purchase:', res.status, body);
    }
  } catch (e) {
    console.error('[CAPI] Exceção ao enviar Purchase:', e);
  }
}
