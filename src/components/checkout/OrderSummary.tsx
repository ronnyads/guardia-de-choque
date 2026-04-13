"use client";

import Image from "next/image";
import { ShieldCheck, Truck, Lock, Clock, Star, Package } from "lucide-react";
import { Kit } from "@/types";
import { useEffect, useState } from "react";

interface ShippingOption {
  name: string;
  price: number;
  deliveryDays: number;
}

interface Props {
  kit: Kit;
  hasOrderBump: boolean;
  orderBumpPrice: number;
  total: number;
  shippingOption?: ShippingOption | null;
}

export default function OrderSummary({ kit, hasOrderBump, orderBumpPrice, total, shippingOption }: Props) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes  = Math.floor(timeLeft / 60);
  const seconds  = timeLeft % 60;
  const fmt      = (v: number) => v.toFixed(2).replace(".", ",");
  const isUrgent = timeLeft < 5 * 60;
  const pixTotal = total * 0.95;

  return (
    <div className="flex flex-col gap-3">

      {/* Urgency timer */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isUrgent ? "bg-[#FEF2F2] border-[#FCA5A5]" : "bg-[#FFF7ED] border-[#FED7AA]"}`}>
        <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? "text-[#DC2626]" : "text-[#EA580C]"} animate-pulse`} />
        <p className="text-[13px] font-medium text-[#0F172A]">
          Reserva expira em:{" "}
          <strong className={`text-[15px] tabular-nums ${isUrgent ? "text-[#DC2626]" : "text-[#EA580C]"}`}>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </strong>
        </p>
      </div>

      {/* Frete destaque */}
      <div className="bg-[#059669] rounded-xl px-4 py-3 flex items-center gap-2.5">
        <Truck className="w-5 h-5 text-white shrink-0" />
        <div>
          {shippingOption ? (
            <>
              <p className="text-white font-bold text-[13px]">
                {shippingOption.price === 0 ? 'FRETE GRÁTIS' : `Frete: R$ ${shippingOption.price.toFixed(2).replace('.', ',')}`}
                {' — '}{shippingOption.name}
              </p>
              <p className="text-[#A7F3D0] text-[11px] mt-0.5">Entrega em {shippingOption.deliveryDays} dias úteis</p>
            </>
          ) : (
            <>
              <p className="text-white font-bold text-[13px]">FRETE GRATIS para todo o Brasil</p>
              <p className="text-[#A7F3D0] text-[11px] mt-0.5">Entrega em 5-12 dias uteis via Correios</p>
            </>
          )}
        </div>
      </div>

      {/* Order card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9]">
          <p className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest">Resumo do Pedido</p>
        </div>

        {/* Product row */}
        <div className="px-5 py-4 flex items-center gap-4 border-b border-[#F1F5F9]">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">
            <Image src="/images/product/hero-product.png" alt={kit.name} fill className="object-contain p-2" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0F172A] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
              {kit.quantity}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A] text-[14px] leading-snug">{kit.name}</p>
            <p className="text-[12px] text-[#94A3B8]">{kit.quantity}x unidade{kit.quantity > 1 ? "s" : ""}</p>
            <span className="inline-flex items-center gap-1 mt-1 bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />Alta Procura
            </span>
          </div>
          <p className="font-bold text-[#0F172A] text-[15px] tabular-nums shrink-0">R$ {fmt(kit.promoPrice)}</p>
        </div>

        {/* Order bump row */}
        {hasOrderBump && (
          <div className="px-5 py-3 flex items-center justify-between bg-[#F0FDF4] border-b border-[#BBF7D0]">
            <div>
              <p className="font-semibold text-[#15803D] text-[13px]">+ Garantia Premium 1 Ano</p>
              <p className="text-[11px] text-[#4ADE80]">Blindagem total contra defeitos</p>
            </div>
            <p className="font-bold text-[#15803D] text-[13px] tabular-nums">R$ {fmt(orderBumpPrice)}</p>
          </div>
        )}

        {/* Totals */}
        <div className="px-5 py-4 flex flex-col gap-2.5">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#64748B]">Subtotal</span>
            <span className="text-[#0F172A] tabular-nums">R$ {fmt(total)}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#059669] font-semibold flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />{shippingOption?.name ?? 'Frete Expresso BR'}
            </span>
            <span className="text-[#059669] font-bold">
              {shippingOption && shippingOption.price > 0
                ? `R$ ${shippingOption.price.toFixed(2).replace('.', ',')}`
                : 'GRÁTIS'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-[#E2E8F0] mt-1">
            <span className="font-bold text-[#0F172A] text-[15px]">Total</span>
            <div className="text-right">
              <p className="text-[26px] font-black text-[#0F172A] tabular-nums leading-none">R$ {fmt(total)}</p>
              <p className="text-[11px] text-[#64748B]">
                No PIX: <strong className="text-[#059669]">R$ {fmt(pixTotal)}</strong>
              </p>
              <p className="text-[11px] text-[#94A3B8]">ou em até {kit.installments?.count ?? 3}x no cartão</p>
            </div>
          </div>
        </div>
      </div>

      {/* Entrega detalhes */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 flex gap-3">
        <Package className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#0F172A]">Informacoes de Entrega</p>
          <ul className="mt-1.5 space-y-1">
            <li className="text-[12px] text-[#475569] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0" />
              {shippingOption ? `Prazo: ${shippingOption.deliveryDays} dias úteis` : 'Prazo: 5 a 12 dias uteis'}
            </li>
            <li className="text-[12px] text-[#475569] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0" />
              {shippingOption ? `Envio via ${shippingOption.name} com rastreio` : 'Envio via Correios com rastreio'}
            </li>
            <li className="text-[12px] text-[#475569] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0" />
              Codigo de rastreio por e-mail
            </li>
          </ul>
        </div>
      </div>

      {/* Reviews mini */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl px-5 py-4 flex items-center gap-3">
        <div className="flex shrink-0">
          {[1,2,3,4,5].map((s) => (<Star key={s} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />))}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#0F172A]">4.7 de 194 avaliacoes</p>
          <p className="text-[11px] text-[#94A3B8]">Clientes satisfeitos em todo o Brasil</p>
        </div>
      </div>

      {/* Guarantee */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-5 py-4 flex gap-3">
        <ShieldCheck className="w-8 h-8 text-[#16A34A] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#15803D] text-[13px]">Garantia de 30 Dias - Risco Zero</p>
          <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "#166534" }}>
            Se nao superar expectativas, devolvemos 100% do seu pagamento sem burocracia.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock className="w-3 h-3" />
        <span>Checkout 100% seguro - criptografia SSL 256-bit</span>
      </div>
    </div>
  );
}
