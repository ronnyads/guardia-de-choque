import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase-server";

// Endpoint temporário de diagnóstico — REMOVER após debug
export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Verificar variáveis de ambiente
  results.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 15) + "...",
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };

  try {
    const supabase = createServiceSupabase();

    // 2. Testar leitura simples (tenants)
    const { data: tenants, error: tenantsErr } = await supabase
      .from("tenants")
      .select("id, slug")
      .limit(3);

    results.tenantsRead = { ok: !tenantsErr, data: tenants, error: tenantsErr?.message };

    // 3. Testar leitura de orders
    const { data: orders, error: ordersErr } = await supabase
      .from("orders")
      .select("id, tenant_id, status, created_at")
      .limit(5)
      .order("created_at", { ascending: false });

    results.ordersRead = { ok: !ordersErr, count: orders?.length, data: orders, error: ordersErr?.message };

    // 4. Testar INSERT de pedido fake (com delete imediato)
    if (tenants && tenants.length > 0) {
      const testTenantId = tenants[0].id;
      const { data: inserted, error: insertErr } = await supabase
        .from("orders")
        .insert({
          tenant_id:           testTenantId,
          customer_name:       "TESTE_DEBUG",
          customer_email:      "debug@teste.com",
          customer_phone:      null,
          customer_address:    null,
          total_amount:        0.01,
          payment_method:      "pix",
          payment_provider:    "mercadopago",
          external_payment_id: "debug-test-" + Date.now(),
          status:              "pending",
          items:               [{ slug: "debug", name: "debug", price: 0.01, qty: 1 }],
        })
        .select("id")
        .single();

      results.insertTest = { ok: !insertErr, data: inserted, error: insertErr?.message, code: insertErr?.code };

      // Deletar o pedido de teste se foi criado
      if (inserted?.id) {
        await supabase.from("orders").delete().eq("id", inserted.id);
        results.insertTest = { ...results.insertTest as object, deleted: true };
      }
    }

    // 5. Verificar colunas da tabela orders
    const { data: cols, error: colsErr } = await supabase
      .rpc("get_orders_columns" as never)
      .single();
    results.columnsRpc = { ok: !colsErr, data: cols, error: colsErr?.message };

  } catch (e: unknown) {
    results.exception = String(e);
  }

  return NextResponse.json(results, { status: 200 });
}
