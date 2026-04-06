import { NextResponse } from 'next/server';
import { createServiceSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, orderId } = body;

    if (!leadId) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const supabase = createServiceSupabase();

    await supabase
      .from('leads')
      .update({
        status:     'converted',
        order_id:   orderId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const e = err as Error;
    console.error('[Lead Convert]', e.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
