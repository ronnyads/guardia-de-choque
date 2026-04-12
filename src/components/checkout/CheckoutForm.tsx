"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, CreditCard, ShieldCheck, User, MapPin, CreditCard as PayIcon } from "lucide-react";
import { gaAddPaymentInfo } from "@/components/analytics/GoogleAnalytics";
import { kwaiAddPaymentInfo } from "@/components/analytics/KwaiPixel";

// --- VALIDATION HELPERS ---
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  return true;
};

const maskDocument = (value: string) => {
  const v = value.replace(/\D/g, "");
  if (v.length <= 11) {
    return v.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    return v.substring(0, 14)
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
  }
};

const inputClass = "w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all";
const inputError = "w-full bg-white border border-[#FCA5A5] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626] transition-all";
const labelClass = "block text-[12px] font-semibold text-[#475569] mb-1.5 uppercase tracking-wide";

interface Props {
  onFinish: (paymentData: unknown) => void;
  hasOrderBump: boolean;
  setHasOrderBump: (val: boolean) => void;
  orderBumpPrice: number;
  kitSlug?: string;
  kitPrice?: number;
}

export default function CheckoutForm({ onFinish, hasOrderBump, setHasOrderBump, orderBumpPrice, kitSlug, kitPrice }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("cartao");
  const [paymentTracked, setPaymentTracked] = useState(false);

  const handlePaymentInteraction = () => {
    if (!paymentTracked) {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddPaymentInfo");
      }
      gaAddPaymentInfo({ paymentType: paymentMethod });
      kwaiAddPaymentInfo(paymentMethod === "pix" ? "pix" : "card");
      setPaymentTracked(true);
    }
  };

  const [documentVal, setDocumentVal] = useState("");
  const [docError, setDocError]       = useState("");
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [personalData, setPersonalData] = useState({ name: "", email: "", phone: "" });
  const leadCaptured = typeof window !== 'undefined' ? { current: !!localStorage.getItem('lead_id') } : { current: false };

  const captureLeadSilently = async (phone: string) => {
    if (leadCaptured.current) return;
    if (!personalData.name || !personalData.email || !phone) return;
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         personalData.name,
          email:        personalData.email,
          phone,
          productSlug:  kitSlug,
          productPrice: kitPrice,
        }),
      });
      const data = await res.json();
      if (data.leadId) {
        localStorage.setItem('lead_id', data.leadId);
        leadCaptured.current = true;
      }
    } catch { /* silencioso — não bloqueia o checkout */ }
  };

  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "", installments: "1" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").substring(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    let raw = val.replace(/\D/g, "").substring(0, 4);
    if (raw.length > 2) return `${raw.substring(0, 2)}/${raw.substring(2, 4)}`;
    return raw;
  };

  const isCnpj = documentVal.replace(/\D/g, "").length > 11;

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskDocument(e.target.value);
    setDocumentVal(masked);
    if (docError) setDocError("");
  };

  const handleDocBlur = async () => {
    const digits = documentVal.replace(/\D/g, "");
    if (digits.length === 0) return;
    if (digits.length <= 11) {
      if (!validateCPF(digits)) setDocError("CPF inválido");
    } else {
      if (!validateCNPJ(digits)) {
        setDocError("CNPJ inválido");
      } else {
        setLoadingCnpj(true);
        try {
          const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
          if (res.ok) {
            const data = await res.json();
            if (data.razao_social) {
              setPersonalData(prev => ({ ...prev, name: data.razao_social }));
              if (data.cep) {
                setAddress(prev => ({
                  ...prev,
                  cep: data.cep.replace(/(\d{5})(\d{3})/, "$1-$2"),
                  street: data.logradouro || prev.street,
                  number: data.numero || prev.number,
                  complement: data.complemento || prev.complement,
                  neighborhood: data.bairro || prev.neighborhood,
                  city: data.municipio || prev.city,
                  state: data.uf || prev.state,
                }));
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar CNPJ", error);
        } finally {
          setLoadingCnpj(false);
        }
      }
    }
  };

  const [address, setAddress] = useState({
    cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: ""
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setAddress(prev => ({ ...prev, cep: value }));
    if (value.replace("-", "").length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = documentVal.replace(/\D/g, "");
    let valid = true;
    if (digits.length <= 11) {
      valid = validateCPF(digits);
      if (!valid) setDocError("CPF inválido");
    } else {
      valid = validateCNPJ(digits);
      if (!valid) setDocError("CNPJ inválido");
    }
    if (!valid) return;

    setPaymentError("");
    setIsProcessing(true);

    let finalToken = null;
    if (paymentMethod === "cartao") {
      try {
        const [month, year] = cardData.expiry.split("/");
        if (!month || !year || year.length !== 2) throw new Error("Validade inválida. Use o formato MM/AA.");
        const fullYear = `20${year}`;
        const cleanCard = cardData.number.replace(/\D/g, "");
        if (cleanCard.length < 13) throw new Error("Número do cartão inválido.");
        const res = await fetch(
          `https://api.mercadopago.com/v1/card_tokens?public_key=${process.env.NEXT_PUBLIC_MP_PUBLIC_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              card_number: cleanCard,
              security_code: cardData.cvv,
              expiration_month: parseInt(month, 10),
              expiration_year: parseInt(fullYear, 10),
              cardholder: {
                name: cardData.name || personalData.name,
                identification: {
                  type: digits.length > 11 ? "CNPJ" : "CPF",
                  number: digits,
                },
              },
            }),
          }
        );
        const data = await res.json();
        if (data.id) {
          finalToken = data.id;
        } else {
          throw new Error("Dados do cartão recusados pela operadora.");
        }
      } catch (err: unknown) {
        const e = err as Error;
        setPaymentError(e.message || "Erro de segurança ao processar cartão.");
        setIsProcessing(false);
        return;
      }
    }

    setIsProcessing(false);
    let detectedBrand = "visa";
    if (cardData.number) {
      const cleanCard = cardData.number.replace(/\D/g, "");
      if (cleanCard.startsWith("5") || cleanCard.startsWith("2")) detectedBrand = "master";
      if (cleanCard.startsWith("3")) detectedBrand = "amex";
      if (cleanCard.startsWith("4")) detectedBrand = "visa";
      if (cleanCard.startsWith("6")) detectedBrand = "elo";
    }

    onFinish({ paymentMethod, token: finalToken, cardData: { ...cardData, brand: detectedBrand }, personalData, document: digits, address });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* ── 1. Identificação ── */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9]">
          <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[12px] font-bold flex items-center justify-center shrink-0">1</div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#64748B]" />
            <h2 className="font-semibold text-[#0F172A] text-[15px]">
              {isCnpj ? "Dados da Empresa" : "Identificação"}
            </h2>
          </div>
          {loadingCnpj && <span className="ml-auto text-[11px] text-[#059669] animate-pulse">Buscando empresa…</span>}
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className={labelClass}>
              CPF ou CNPJ
              {docError && <span className="ml-2 text-[#DC2626] normal-case font-normal tracking-normal">{docError}</span>}
            </label>
            <input
              required
              type="text"
              value={documentVal}
              onChange={handleDocumentChange}
              onBlur={handleDocBlur}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className={docError ? inputError : inputClass}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className={labelClass}>{isCnpj ? "Razão Social" : "Nome Completo"}</label>
            <input required type="text" value={personalData.name}
              onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
              placeholder={isCnpj ? "Nome da empresa" : "Seu nome completo"}
              className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>E-mail <span className="text-[#DC2626] normal-case font-normal tracking-normal">(para rastreio)</span></label>
            <input required type="email" value={personalData.email}
              onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
              placeholder="seu@email.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Celular / WhatsApp</label>
            <input required type="tel" value={personalData.phone}
              onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
              onBlur={(e) => captureLeadSilently(e.target.value)}
              placeholder="(11) 99999-9999" className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── 2. Entrega ── */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9]">
          <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[12px] font-bold flex items-center justify-center shrink-0">2</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#64748B]" />
            <h2 className="font-semibold text-[#0F172A] text-[15px]">Endereço de Entrega</h2>
          </div>
          {loadingCep && <span className="ml-auto text-[11px] text-[#059669] animate-pulse">Buscando CEP…</span>}
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>CEP</label>
            <input required type="text" maxLength={9} value={address.cep}
              onChange={handleCepChange}
              placeholder="00000-000" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Rua / Avenida</label>
            <input required type="text" value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Nome da rua" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Número</label>
            <input required type="text" value={address.number}
              onChange={(e) => setAddress({ ...address, number: e.target.value })}
              placeholder="123" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Complemento</label>
            <input type="text" value={address.complement}
              onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              placeholder="Apto, Bloco…" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Bairro</label>
            <input required type="text" value={address.neighborhood}
              onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              placeholder="Seu bairro" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Cidade</label>
            <input required type="text" value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="Sua cidade" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>UF</label>
            <input required type="text" maxLength={2} value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
              placeholder="SP" className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── 3. Pagamento ── */}
      <section className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F1F5F9]">
          <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[12px] font-bold flex items-center justify-center shrink-0">3</div>
          <div className="flex items-center gap-2">
            <PayIcon className="w-4 h-4 text-[#64748B]" />
            <h2 className="font-semibold text-[#0F172A] text-[15px]">Pagamento</h2>
          </div>
          <span className="ml-auto flex items-center gap-1 text-[11px] text-[#059669] font-medium">
            <Lock className="w-3 h-3" /> SSL 256-bit
          </span>
        </div>
        <div className="p-6 flex flex-col gap-5">
          {/* Payment method toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setPaymentMethod("cartao"); handlePaymentInteraction(); }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
                paymentMethod === "cartao"
                  ? "border-[#0F172A] bg-[#F8FAFC]"
                  : "border-[#E2E8F0] hover:border-[#94A3B8]"
              }`}
            >
              <CreditCard className={`w-5 h-5 mb-1.5 ${paymentMethod === "cartao" ? "text-[#0F172A]" : "text-[#94A3B8]"}`} />
              <span className={`text-[13px] font-semibold ${paymentMethod === "cartao" ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>
                Cartão (até 12x)
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod("pix"); handlePaymentInteraction(); }}
              className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
                paymentMethod === "pix"
                  ? "border-[#059669] bg-[#F0FDF4]"
                  : "border-[#E2E8F0] hover:border-[#86EFAC]"
              }`}
            >
              <svg className={`w-5 h-5 mb-1.5 ${paymentMethod === "pix" ? "text-[#059669]" : "text-[#94A3B8]"}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.996 1.401L2.016 7.39V16.63L11.996 22.599L21.984 16.63V7.39L11.996 1.401ZM11.996 21.054L3.388 15.864V8.156L11.996 2.946L20.612 8.156V15.864L11.996 21.054Z" />
                <path d="M7.788 11.233L10.596 8.425L11.996 9.825L9.188 12.633L7.788 11.233Z" />
                <path d="M16.204 11.233L13.396 8.425L11.996 9.825L14.804 12.633L16.204 11.233Z" />
                <path d="M11.996 14.033L14.804 11.225L13.404 9.825L10.596 12.633L11.996 14.033Z" />
                <path d="M7.788 12.633L10.596 15.441L11.996 14.041L9.188 11.233L7.788 12.633Z" />
                <path d="M16.204 12.633L13.396 15.441L11.996 14.041L14.804 11.233L16.204 12.633Z" />
              </svg>
              <span className={`text-[13px] font-semibold ${paymentMethod === "pix" ? "text-[#059669]" : "text-[#94A3B8]"}`}>
                PIX (5% OFF)
              </span>
            </button>
          </div>

          {/* Card fields */}
          {paymentMethod === "cartao" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-4">
                <label className={labelClass}>Número do Cartão</label>
                <div className="relative">
                  <input required type="text" value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                    onFocus={handlePaymentInteraction}
                    placeholder="0000 0000 0000 0000"
                    className={`${inputClass} pl-10`} />
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Nome no Cartão</label>
                <input required type="text" value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                  placeholder="Como impresso no cartão" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Validade</label>
                <input required type="text" value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                  placeholder="MM/AA" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CVV</label>
                <div className="relative">
                  <input required type="text" maxLength={4} value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })}
                    placeholder="123" className={`${inputClass} pr-10`} />
                  <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#CBD5E1] pointer-events-none" />
                </div>
              </div>
              <div className="md:col-span-4">
                <label className={labelClass}>Parcelas</label>
                <select value={cardData.installments}
                  onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                  className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="1">À vista — com desconto extra</option>
                  <option value="3">3x sem juros (Recomendado)</option>
                  <option value="6">6x sem juros</option>
                  <option value="12">12x no cartão</option>
                </select>
              </div>
              {paymentError && (
                <div className="md:col-span-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-3 text-[#DC2626] text-[13px] font-medium text-center">
                  {paymentError}
                </div>
              )}
            </div>
          )}

          {/* PIX info */}
          {paymentMethod === "pix" && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 bg-[#059669] rounded-full flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.996 1.401L2.016 7.39V16.63L11.996 22.599L21.984 16.63V7.39L11.996 1.401ZM11.996 21.054L3.388 15.864V8.156L11.996 2.946L20.612 8.156V15.864L11.996 21.054Z" />
                </svg>
              </div>
              <p className="font-bold text-[#15803D] text-[15px]">5% de desconto aplicado!</p>
              <p className="text-[13px] text-[#166534]">QR Code gerado no próximo passo — aprovação em segundos.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Order Bump ── */}
      <div
        className={`rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${
          hasOrderBump ? "border-[#0F172A] bg-[#F8FAFC]" : "border-[#E2E8F0] bg-white hover:border-[#94A3B8]"
        }`}
        onClick={() => setHasOrderBump(!hasOrderBump)}
      >
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#0F172A]">
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Oferta Especial</span>
          <span className="text-[11px] font-bold text-[#FCD34D]">Adicionar ao Pedido</span>
        </div>
        <div className="flex gap-4 p-5">
          <div className="pt-0.5 pointer-events-none shrink-0">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              hasOrderBump ? "bg-[#0F172A] border-[#0F172A]" : "border-[#CBD5E1]"
            }`}>
              {hasOrderBump && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1 pointer-events-none">
            <p className="font-bold text-[#0F172A] text-[14px] mb-1">
              Garantia Estendida <span className="text-[#DC2626]">1 Ano</span> — Blindagem Total
            </p>
            <p className="text-[13px] text-[#475569] leading-relaxed mb-2">
              Protegido contra qualquer defeito ou mal funcionamento por 12 meses. Troca imediata e frete grátis por nossa conta.
            </p>
            <p className="text-[14px] text-[#475569]">
              Sim, adicionar por apenas{" "}
              <strong className="text-[#0F172A] text-[16px]">R$ {orderBumpPrice.toFixed(2).replace(".", ",")}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full flex items-center justify-center gap-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-[16px] py-5 rounded-2xl transition-all ${
          isProcessing ? "opacity-70 cursor-wait" : "active:scale-[0.98]"
        }`}
      >
        <Lock className="w-5 h-5" />
        {isProcessing ? "Processando segurança…" : "Finalizar Compra Segura"}
      </button>

      {/* Payment badges */}
      <div className="flex items-center justify-center gap-3 flex-wrap mt-1">
        {[
          { src: "/images/product/bandeiras/pix.png",       alt: "PIX",        w: 32, h: 32 },
          { src: "/images/product/bandeiras/visa.png",       alt: "Visa",       w: 44, h: 14 },
          { src: "/images/product/bandeiras/mastercard.png", alt: "Mastercard", w: 30, h: 22 },
          { src: "/images/product/bandeiras/elo.png",        alt: "Elo",        w: 32, h: 20 },
        ].map(({ src, alt, w, h }) => (
          <div key={alt} className="flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5">
            <Image src={src} alt={alt} width={w} height={h} className="object-contain" />
          </div>
        ))}
        <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          100% Seguro
        </span>
      </div>
    </form>
  );
}
