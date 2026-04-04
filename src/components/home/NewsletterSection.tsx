"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simula delay de API
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="bg-[#09090B] relative overflow-hidden py-20">
      {/* Orbs decorativos */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 right-0 w-96 h-96 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle,#fff 0%,transparent 70%)" }}
      />

      <div className="max-w-2xl mx-auto px-4 md:px-6 text-center relative z-10">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden />
          <span className="text-white/70 text-[12px] font-medium">Ofertas exclusivas para assinantes</span>
        </div>

        {/* Headline */}
        <h2
          className="text-white mb-4 leading-tight"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,4vw,44px)" }}
        >
          Receba ofertas antes
          <br />
          <em className="not-italic text-transparent" style={{
            backgroundImage: "linear-gradient(90deg,#F8FAFC,#94A3B8)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}>
            de todo mundo.
          </em>
        </h2>
        <p className="text-white/50 text-[15px] mb-8 leading-relaxed">
          Mais de <strong className="text-white/80">1.200 pessoas</strong> já recebem nossas promoções exclusivas.
          Sem spam — só o que vale a pena.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-semibold text-[16px]">Perfeito! Você está na lista. 🎉</p>
            <p className="text-white/40 text-[13px]">Fique de olho na sua caixa de entrada.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 bg-white/10 text-white placeholder-white/30 border border-white/15 rounded-full px-5 py-3.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
              aria-label="Seu e-mail"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary bg-white text-[#09090B] hover:bg-white/90 shrink-0 animate-pulse-ring disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#09090B]/30 border-t-[#09090B] rounded-full animate-spin" />
              ) : (
                <>
                  Quero receber
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-white/25 text-[11px] mt-4">
          Sem spam. Cancele quando quiser. Seus dados estão seguros.
        </p>
      </div>
    </section>
  );
}
