import { createServiceSupabase } from "@/lib/supabase-server";
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

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
}

export default async function LojasPage() {
  await requireSuperAdmin();

  const service = createServiceSupabase();
  const { data: tenants } = await service
    .from("tenants")
    .select("id, slug, name, status, plan, created_at, custom_domain")
    .order("created_at");

  const statusLabel: Record<string, string> = { active: "Ativo", trial: "Trial", inactive: "Inativo" };
  const statusColor: Record<string, string> = {
    active:   "bg-emerald-50 text-emerald-700",
    trial:    "bg-amber-50 text-amber-700",
    inactive: "bg-slate-100 text-slate-500",
  };
  const planLabel: Record<string, string> = { free: "Free", starter: "Starter", pro: "Pro" };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Lojas Cadastradas</h1>
          <p className="text-[#64748B] text-sm">{tenants?.length ?? 0} loja(s) na plataforma.</p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-left text-xs font-semibold uppercase tracking-wide">
                <th className="px-6 py-3">Loja</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Domínio</th>
                <th className="px-6 py-3">Plano</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {(tenants ?? []).map((t) => (
                <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{t.name ?? "—"}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#64748B]">{t.slug}</td>
                  <td className="px-6 py-4 text-[#64748B] text-xs">{t.custom_domain ?? "—"}</td>
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
