"use client";

/**
 * Helper client-side para disparar eventos Meta com deduplicação.
 * Cada função:
 *  1. Dispara fbq() no browser (pixel client-side)
 *  2. Chama a API route server-side (CAPI) com os mesmos dados e eventID
 *
 * O Meta usa o eventID igual para deduplicar — nunca conta duas vezes.
 */

function genEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getFbCookies(): { fbp: string | null; fbc: string | null } {
  if (typeof document === 'undefined') return { fbp: null, fbc: null };
  const cookies = Object.fromEntries(
    document.cookie.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  return {
    fbp: cookies['_fbp'] || null,
    fbc: cookies['_fbc'] || null,
  };
}

function getStoredUser(): { email: string | null; phone: string | null } {
  try {
    // Tenta recuperar dados do cliente do localStorage (gravados no lead capture)
    const raw = typeof window !== 'undefined' ? localStorage.getItem('checkout_user') : null;
    if (!raw) return { email: null, phone: null };
    return JSON.parse(raw);
  } catch {
    return { email: null, phone: null };
  }
}

function sendCapiAsync(endpoint: string, payload: Record<string, unknown>): void {
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true, // sobrevive a navegação de página
  }).catch(() => {}); // silencioso — nunca quebra o cliente
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

export function metaViewContent(opts: {
  productSlug: string;
  productName: string;
  value: number;
}) {
  if (typeof window === 'undefined') return;
  const eventId = genEventId('vc');
  const { fbp, fbc } = getFbCookies();

  // Browser
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids:  [opts.productSlug],
      content_type: 'product',
      content_name: opts.productName,
      value:        opts.value,
      currency:     'BRL',
    }, { eventID: eventId });
  }

  // Server (CAPI)
  sendCapiAsync('/api/capi/view-content', {
    productSlug: opts.productSlug,
    productName: opts.productName,
    value:       opts.value,
    eventId,
    fbp,
    fbc,
    ...getStoredUser(),
  });
}

export function metaAddToCart(opts: {
  productSlug: string;
  productName: string;
  value: number;
}) {
  if (typeof window === 'undefined') return;
  const eventId = genEventId('atc');
  const { fbp, fbc } = getFbCookies();

  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids:  [opts.productSlug],
      content_type: 'product',
      content_name: opts.productName,
      value:        opts.value.toFixed(2),
      currency:     'BRL',
    }, { eventID: eventId });
  }

  sendCapiAsync('/api/capi/add-to-cart', {
    productSlug: opts.productSlug,
    productName: opts.productName,
    value:       opts.value,
    eventId,
    fbp,
    fbc,
    ...getStoredUser(),
  });
}

export function metaInitiateCheckout(opts: {
  productSlug: string;
  productName: string;
  value: number;
}) {
  if (typeof window === 'undefined') return;
  const eventId = genEventId('ic');
  const { fbp, fbc } = getFbCookies();

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: opts.productName,
      currency:     'BRL',
      value:        opts.value,
    }, { eventID: eventId });
  }

  sendCapiAsync('/api/capi/initiate-checkout', {
    productSlug: opts.productSlug,
    productName: opts.productName,
    value:       opts.value,
    eventId,
    fbp,
    fbc,
    ...getStoredUser(),
  });
}

export function metaAddPaymentInfo(opts: {
  productSlug: string;
  productName: string;
  value: number;
  email?: string;
  phone?: string;
}) {
  if (typeof window === 'undefined') return;
  const eventId = genEventId('api');
  const { fbp, fbc } = getFbCookies();

  if (window.fbq) {
    window.fbq('track', 'AddPaymentInfo', {
      content_name: opts.productName,
      currency:     'BRL',
      value:        opts.value,
    }, { eventID: eventId });
  }

  sendCapiAsync('/api/capi/add-payment-info', {
    productSlug: opts.productSlug,
    productName: opts.productName,
    value:       opts.value,
    eventId,
    fbp,
    fbc,
    email: opts.email || null,
    phone: opts.phone || null,
  });
}

export function metaPurchase(opts: {
  value: number;
  productName: string;
  eventId: string; // vem do backend (paymentId)
}) {
  if (typeof window === 'undefined') return;
  const { fbp: _fbp, fbc: _fbc } = getFbCookies(); // lidos mas Purchase CAPI é disparado pelo server

  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value:        opts.value.toFixed(2),
      currency:     'BRL',
      content_name: opts.productName,
    }, { eventID: opts.eventId });
  }
  // CAPI Purchase é disparado pelo server (checkout/status, card, stripe-card routes)
}

/** Salva email/phone no localStorage para enriquecer eventos CAPI */
export function storeCheckoutUser(email: string, phone: string): void {
  try {
    localStorage.setItem('checkout_user', JSON.stringify({ email, phone }));
  } catch { /* ignorar */ }
}
