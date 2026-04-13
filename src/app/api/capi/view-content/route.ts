import { NextResponse } from 'next/server';
import { sendCapiViewContent } from '@/lib/meta-capi';
import { getMetaPixelConfig } from '@/lib/store-config';
import { resolveProductTenant } from '@/lib/checkout-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productSlug, productName, value, eventId, email, phone, fbp, fbc } = body;

    if (!productSlug || !eventId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const prod = await resolveProductTenant(String(productSlug));
    if (!prod) return NextResponse.json({ ok: false }, { status: 200 }); // silencioso

    const meta = await getMetaPixelConfig(prod.tenantId);

    const clientIp    = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                     ?? request.headers.get('x-real-ip')
                     ?? null;
    const clientAgent = request.headers.get('user-agent') ?? null;

    await sendCapiViewContent({
      ...meta,
      email:       email  || null,
      phone:       phone  || null,
      eventId,
      clientIp,
      clientAgent,
      fbp:         fbp || null,
      fbc:         fbc || null,
      value:       value || undefined,
      contentName: productName || prod.productName,
      contentIds:  [productSlug],
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 }); // nunca quebra o cliente
  }
}
