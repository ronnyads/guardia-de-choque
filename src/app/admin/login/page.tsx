"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ShieldCheck, BarChart3, Layers, Eye, EyeOff } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Multi-loja unificada",
    desc: "Gerencie múltiplos lojistas em um único painel com isolamento completo de dados.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamentos por tenant",
    desc: "Cada lojista conecta suas próprias chaves de Mercado Pago ou Stripe.",
  },
  {
    icon: BarChart3,
    title: "Analytics integrado",
    desc: "Meta Pixel e Kwai configurados individualmente, sem conflito entre lojas.",
  },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    // Verifica se é super admin da plataforma
    const { data: superAdmin } = await supabase
      .from("super_admins")
      .select("user_id")
      .eq("user_id", authData.user.id)
      .single();

    if (superAdmin) {
      router.push("/super-admin");
    } else {
      router.push("/admin");
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <aside
        className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "#0F172A" }}
      >
        {/* Subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #059669, transparent 70%)" }}
        />

        {/* Brand */}
        <div className="relative">
          <span
            className="text-white text-[22px] font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            CommerceOS
          </span>
          <span className="ml-2 text-[10px] font-semibold tracking-widest text-emerald-400 uppercase align-middle">
            Admin
          </span>
        </div>

        {/* Feature list */}
        <div className="relative flex flex-col gap-8">
          <div>
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-6">
              Plataforma SaaS
            </p>
            <h2 className="text-white text-3xl font-bold leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
              Infraestrutura para<br />qualquer e-commerce.
            </h2>
          </div>

          <ul className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-slate-400 text-[13px] leading-relaxed mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="relative text-slate-600 text-xs">
          © {new Date().getFullYear()} CommerceOS · Acesso restrito
        </p>
      </aside>

      {/* ── Right panel ── */}
      <main className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile brand */}
          <p
            className="lg:hidden text-[#0F172A] text-xl font-bold mb-8 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            CommerceOS
          </p>

          <div className="mb-8">
            <h1 className="text-[#0F172A] text-2xl font-bold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-[#64748B] text-sm mt-1.5">
              Entre com suas credenciais de administrador.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-semibold text-[#374151]">
                E-mail Corporativo
              </label>
              <input
                id="email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                className="h-11 border border-[#CBD5E1] rounded-xl px-4 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[13px] font-semibold text-[#374151]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full border border-[#CBD5E1] rounded-xl pl-4 pr-11 text-sm bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-11 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Autenticando...
                </span>
              ) : (
                "Entrar no Painel"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[#94A3B8] text-xs">
            Acesso restrito · CommerceOS © {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
