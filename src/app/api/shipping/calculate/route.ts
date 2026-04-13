import { NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';
import { calculateShipping, type ShippingOption } from '@/lib/superfrete';

const FALLBACK: ShippingOption[] = [
  { id: 0, name: 'Correios', price: 0, deliveryDays: 8, company: 'Correios' },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cep  = String(body.cep ?? '').replace(/\D/g, '');
    const slug = String(body.slug ?? '');
    const qty  = Math.max(1, Number(body.qty ?? 1));

    if (cep.length !== 8 || !slug) {
      return NextResponse.json({ options: FALLBACK, free: true });
    }

    const supabase = createServiceSupabase();

    // Resolve product
    const { data: product } = await supabase
      .from('products')
      .select('tenant_id, weight_g, length_cm, width_cm, height_cm')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (!product) {
      return NextResponse.json({ options: FALLBACK, free: true });
    }

    // Shipping config
    const { data: config } = await supabase
      .from('tenant_config')
      .select('shipping_origin_cep, shipping_free')
      .eq('tenant_id', product.tenant_id)
      .single();

    const originCep = config?.shipping_origin_cep ?? '';
    const isFree    = config?.shipping_free !== false; // default true

    if (!originCep || !process.env.SUPERFRETE_TOKEN) {
      return NextResponse.json({ options: FALLBACK, free: isFree }, {
        headers: { 'Cache-Control': 'public, max-age=3600' },
      });
    }

    const pkg = {
      weightG:  product.weight_g  ?? 500,
      lengthCm: product.length_cm ?? 20,
      widthCm:  product.width_cm  ?? 15,
      heightCm: product.height_cm ?? 5,
    };

    const packages = Array.from({ length: qty }, () => pkg);
    const options  = await calculateShipping(originCep, cep, packages);

    if (options.length === 0) {
      return NextResponse.json({ options: FALLBACK, free: isFree }, {
        headers: { 'Cache-Control': 'public, max-age=3600' },
      });
    }

    const finalOptions = isFree ? options.map(o => ({ ...o, price: 0 })) : options;

    return NextResponse.json({ options: finalOptions, free: isFree }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ options: FALLBACK, free: true });
  }
}
