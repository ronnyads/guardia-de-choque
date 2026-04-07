"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import type { NewsletterConfig } from "@/types/sections";

interface Props {
  config?: NewsletterConfig;
}

export default function NewsletterSection({ config }: Props) {
  const headline    = config?.headline    ?? 'Receba ofertas antes de todo mundo.';
  const subtext     = config?.subtext     ?? 'Mais de 1.200 pessoas já recebem nossas promoções exclusivas. Sem spam — só o que vale a pena.';
  const buttonText  = config?.button_text ?? 'Quero receber';
  const placeholder = config?.placeholder ?? 'seu@email.com';
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section style={{ background: "#09090B" }} className="relative overflow-hidden">
      {/* Orbs decorativos */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%)" }}
      />

      <div className="container-wide section-pad relative z-10">
        {/* ── Inner content — centered ──────────────────────── */}
        <div className="max-w-xl mx-auto text-center">

          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#FCD34D" }} aria-hidden />
            <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
              Ofertas exclusivas para assinantes
            </span>
          </div>

          {/* Headline */}
          <h2
            className="mb-4 leading-tight"
            style={{
              fontFamily: "var(--font-playfair, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            {headline}
          </h2>

          {/* Subtext */}
          <p className="text-[15px] mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            {subtext}
          </p>

          {/* Form */}
          {submitted ? (
            <div className="flex flex-col items-center gap-3 animate-scale-in">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(22,163,74,0.15)",
                  border: "1px solid rgba(22,163,74,0.30)",
                }}
              >
                <Check className="w-6 h-6" style={{ color: "#4ADE80" }} />
              </div>
              <p className="font-semibold text-[16px]" style={{ color: "#FFFFFF" }}>
                Perfeito! Você está na lista. 🎉
              </p>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.40)" }}>
                Fique de olho na sua caixa de entrada.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full"
              aria-label="Formulário de newsletter"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 w-full rounded-full px-5 py-3.5 text-[14px] focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#FFFFFF",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.35)";
                  e.target.style.background = "rgba(255,255,255,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.14)";
                  e.target.style.background = "rgba(255,255,255,0.08)";
                }}
                aria-label="Seu e-mail"
              />
              {/* UI/UX Rule: WHITE button on dark section */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-white shrink-0 sm:w-auto w-full disabled:opacity-60"
                aria-label="Assinar newsletter"
              >
                {loading ? (
                  <span
                    className="w-4 h-4 rounded-full animate-spin"
                    style={{ border: "2px solid rgba(9,9,11,0.2)", borderTopColor: "#09090B" }}
                    aria-hidden
                  />
                ) : (
                  <>
                    {buttonText}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Legal */}
          <p className="text-[11px] mt-5" style={{ color: "rgba(255,255,255,0.25)" }}>
            Sem spam. Cancele quando quiser. Seus dados estão seguros.
          </p>
        </div>
      </div>
    </section>
  );
}
