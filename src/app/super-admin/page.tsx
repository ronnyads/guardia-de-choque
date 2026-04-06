import { createServiceSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { Store, Users, CheckCircle, Clock } from "lucide-react";

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const service = createServiceSupabase();
  const { data } = await service
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!data) redirect("/admin/login");
  return user;
}

export default async function SuperAdminPage() {
  await requireSuperAdmin();

  const service = createServiceSupabase();

  const [
    { data: tenants },
    { count: totalUsers },
  ] = await Promise.all([
    service.from("tenants").select("id, slug, name, status, plan, created_at").order("created_at"),
    service.from("tenant_users").select("*", { count: "exact", head: true }),
  ]);

  const activeCount  = tenants?.filter((t) => t.status === "active").length ?? 0;
  const trialCount   = tenants?.filter((t) => t.status === "trial").length ?? 0;
  const total        = tenants?.length ?? 0;

  const statusLabel: Record<string, string> = {
    active:   "Ativo",
    trial:    "Trial",
    inactive: "Inativo",
  };
  const statusColor: Record<string, string> = {
    active:   "bg-emerald-50 text-emerald-700",
    trial:    "bg-amber-50 text-amber-700",
    inactive: "bg-slate-100 text-slate-500",
  };
  const planLabel: Record<string, string> = {
    free:    "Free",
    starter: "Starter",
    pro:     "Pro",
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Visão Geral da Plataforma</h1>
        <p className="text-[#64748B] text-sm">Todos os tenants e métricas do CommerceOS.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] font-medium">Total de Lojas</p>
            <p className="text-3xl font-bold text-[#0F172A] tabular-nums">{total}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] font-medium">Lojas Ativas</p>
            <p className="text-3xl font-bold text-[#0F172A] tabular-nums">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#64748B] font-medium">Em Trial</p>
            <p className="text-3xl font-bold text-[#0F172A] tabular-nums">{trialCount}</p>
          </div>
        </div>
      </div>

      {/* Tabela de tenants */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-semibold text-[#0F172A]">Lojas Cadastradas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-left text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3">Loja</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Plano</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {(tenants ?? []).map((t) => (
                <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{t.name ?? "—"}</td>
                  <td className="px-6 py-4 text-[#64748B] font-mono text-xs">{t.slug}</td>
                  <td className="px-6 py-4 text-[#64748B]">{planLabel[t.plan] ?? t.plan}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[t.status] ?? "bg-slate-100 text-slate-500"}`}>
                      {statusLabel[t.status] ?? t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#94A3B8] text-xs tabular-nums">
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
