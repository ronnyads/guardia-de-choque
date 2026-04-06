"use client";

import { useState } from "react";
import { Zap, Shield, X } from "lucide-react";

interface Props {
  upsellPrice: number;
  onDecision: (accepted: boolean) => void;
}

export default function UpsellModal({ upsellPrice, onDecision }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAction = (accepted: boolean) => {
    setLoading(true);
    setTimeout(() => onDecision(accepted), 1000);
  };

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">

        {/* Barra de urgência */}
        <div className="bg-[#0F172A] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400 text-[11px] font-bold uppercase tracking-wider">Oferta exclusiva — apenas agora</span>
          </div>
          <button onClick={() => handleAction(false)} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-6 flex flex-col gap-5">

          {/* Headline */}
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#059669] mb-2">Seu pedido foi recebido ✓</p>
            <h2 className="text-[22px] font-black text-[#0F172A] leading-tight">
              Leve uma Guardiã extra<br />
              <span className="text-[#059669]">pelo preço de custo</span>
            </h2>
            <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
              91% dos clientes pedem uma unidade reserva depois. Aproveite agora — o frete já está pago.
            </p>
          </div>

          {/* Produto destaque */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-[#0F172A] rounded-xl flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#0F172A] text-[14px]">Guardiã de Choque — Reserva</p>
              <p className="text-[12px] text-[#64748B] mt-0.5">Unidade extra + coldre + cabo de carga</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] text-[#94A3B8] line-through">R$ 97,90</span>
                <span className="text-[16px] font-black text-[#059669]">R$ {fmt(upsellPrice)}</span>
                <span className="bg-[#DCFCE7] text-[#166534] text-[10px] font-bold px-1.5 py-0.5 rounded-md">-28%</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleAction(true)}
              disabled={loading}
              className="w-full bg-[#059669] hover:bg-[#047857] disabled:opacity-60 text-white font-black text-[15px] py-4 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  SIM! QUERO ADICIONAR POR R$ {fmt(upsellPrice)}
                </>
              )}
            </button>
            <button
              onClick={() => handleAction(false)}
              disabled={loading}
              className="w-full text-center py-3 px-4 text-[13px] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Não quero — finalizar pedido sem o extra</span>
              <span className="text-[10px] bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#94A3B8]">clique aqui</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
