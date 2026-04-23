export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function getDisplayName(userEmail: string | undefined, metadata: Record<string, unknown>) {
  return (
    pickString(metadata.full_name) ||
    pickString(metadata.name) ||
    pickString(metadata.display_name) ||
    pickString(metadata.username) ||
    userEmail?.split("@")[0] ||
    "Usuario"
  );
}

function getInitials(displayName: string, email?: string) {
  const nameParts = displayName
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }

  if (nameParts[0]) return nameParts[0].slice(0, 2).toUpperCase();
  return (email?.slice(0, 2) ?? "RV").toUpperCase();
}

function getPlanLabel(plan: string) {
  if (plan === "subscription") return "Assinatura";
  if (plan === "package") return "Pacote";
  return "Free";
}

function getProviderLabel(provider: string | null) {
  if (!provider || provider === "email") return "Auth email";
  return provider.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Nao informado";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function ProfilePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const [profileResult, photosResult, projectsResult, assetsResult] = await Promise.all([
    supabase.from("users").select("credits, plan").eq("id", user.id).single(),
    supabase.from("photos").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("studio_projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("studio_assets").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>;
  const displayName = getDisplayName(user.email ?? undefined, metadata);
  const initials = getInitials(displayName, user.email ?? undefined);
  const avatarUrl = pickString(metadata.avatar_url) || pickString(metadata.picture);
  const plan = profileResult.data?.plan ?? "free";
  const credits = profileResult.data?.credits ?? 0;
  const provider = pickString(appMetadata.provider) ?? "email";

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white">
          <div className="bg-[#0F172A] px-8 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Minha conta</p>
            <div className="mt-4 flex items-center gap-4">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
                  {initials}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <p className="mt-1 text-sm text-white/70">{user.email ?? "Sem email"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-8 py-8 md:grid-cols-4">
            {[
              { label: "Plano", value: getPlanLabel(plan) },
              { label: "Creditos", value: String(credits) },
              { label: "Fotos", value: String(photosResult.count ?? 0) },
              { label: "Projetos", value: String(projectsResult.count ?? 0) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <p className="text-xs uppercase tracking-wide text-[#64748B]">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-[#0F172A]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
            <h2 className="text-lg font-bold text-[#0F172A]">Detalhes da conta</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] pb-3">
                <dt className="text-[#64748B]">Provedor</dt>
                <dd className="font-medium text-[#0F172A]">{getProviderLabel(provider)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] pb-3">
                <dt className="text-[#64748B]">Email verificado</dt>
                <dd className="font-medium text-[#0F172A]">{user.email_confirmed_at ? "Sim" : "Nao"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] pb-3">
                <dt className="text-[#64748B]">Criado em</dt>
                <dd className="font-medium text-[#0F172A]">{formatDate(user.created_at)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748B]">Ultimo acesso</dt>
                <dd className="font-medium text-[#0F172A]">{formatDate(user.last_sign_in_at ?? null)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
            <h2 className="text-lg font-bold text-[#0F172A]">Uso do studio</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] pb-3">
                <dt className="text-[#64748B]">Assets gerados</dt>
                <dd className="font-medium text-[#0F172A]">{assetsResult.count ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-[#F1F5F9] pb-3">
                <dt className="text-[#64748B]">Projetos salvos</dt>
                <dd className="font-medium text-[#0F172A]">{projectsResult.count ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#64748B]">User ID</dt>
                <dd className="max-w-[18rem] truncate font-medium text-[#0F172A]">{user.id}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
