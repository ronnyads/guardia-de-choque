import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { tenantId } = await requireTenant();
    const supabase = await createServerSupabase();

    const { data } = await supabase
      .from('tenant_config')
      .select('primary_color, accent_color, font_heading, font_body, brand_name')
      .eq('tenant_id', tenantId)
      .single();

    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({});
  }
}
