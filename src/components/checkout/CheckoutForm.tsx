import { useState } from "react";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";

// --- VALIDATION HELPERS ---
const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10)) ) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11) ) ) return false;
  return true;
};

const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0,tamanho);
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
  numeros = cnpj.substring(0,tamanho);
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
// -------------------------

interface Props {
  onFinish: (paymentData: any) => void;
  hasOrderBump: boolean;
  setHasOrderBump: (val: boolean) => void;
  orderBumpPrice: number;
}

export default function CheckoutForm({ onFinish, hasOrderBump, setHasOrderBump, orderBumpPrice }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("cartao");
  const [paymentTracked, setPaymentTracked] = useState(false);

  const handlePaymentInteraction = () => {
    if (!paymentTracked) {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "AddPaymentInfo");
      }
      setPaymentTracked(true);
    }
  };

  const [documentVal, setDocumentVal] = useState("");
  const [docError, setDocError] = useState("");
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [personalData, setPersonalData] = useState({ name: "", email: "", phone: "" });
  
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "", installments: "1" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const formatCardNumber = (val: string) => val.replace(/\D/g, "").substring(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
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
      if (!validateCPF(digits)) setDocError("CPF Inválido");
    } else {
      if (!validateCNPJ(digits)) {
        setDocError("CNPJ Inválido");
      } else {
        // Valido, buscar CNPJ
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
                  state: data.uf || prev.state
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
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    
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
      if (!valid) setDocError("CPF Inválido");
    } else {
      valid = validateCNPJ(digits);
      if (!valid) setDocError("CNPJ Inválido");
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

        // Tokenização Frontend Blindada
        const res = await fetch(`https://api.mercadopago.com/v1/card_tokens?public_key=${process.env.NEXT_PUBLIC_MP_PUBLIC_KEY}`, {
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
                number: digits
              }
            }
          })
        });
        
        const data = await res.json();
        
        if (data.id) {
          finalToken = data.id;
        } else {
          throw new Error("Dados do cartão recusados pela operadora.");
        }
      } catch (err: any) {
        setPaymentError(err.message || "Erro de segurança ao processar cartão.");
        setIsProcessing(false);
        return;
      }
    }

    setIsProcessing(false);
    onFinish({ paymentMethod, token: finalToken, cardData, personalData, document: digits, address });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* IDENTIFICAÇÃO */}
      <section className="bg-surface border border-white/10 rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isCnpj ? "Dados da Empresa" : "Dados Pessoais"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2 relative">
            <label className="block text-sm font-medium text-text-muted mb-1">
              CPF ou CNPJ (Para Nota Fiscal)
              {docError && <span className="text-red-400 text-xs ml-2 animate-pulse">{docError}</span>}
              {loadingCnpj && <span className="text-accent text-xs ml-2 animate-pulse">Buscando dados da empresa...</span>}
            </label>
            <input 
              required 
              type="text" 
              value={documentVal}
              onChange={handleDocumentChange}
              onBlur={handleDocBlur}
              placeholder="000.000.000-00 ou 00.000.000/0000-00" 
              className={`w-full bg-body border rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-1 transition-all ${docError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-accent focus:ring-accent'}`} 
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-muted mb-1">
              {isCnpj ? "Razão Social / Nome Fantasia" : "Nome Completo"}
            </label>
            <input required type="text" value={personalData.name} onChange={(e) => setPersonalData({...personalData, name: e.target.value})} placeholder={isCnpj ? "Nome da sua Empresa" : "Digite seu nome completo"} className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">E-mail</label>
            <input required type="email" value={personalData.email} onChange={(e) => setPersonalData({...personalData, email: e.target.value})} placeholder="seu@email.com" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Celular / WhatsApp</label>
            <input required type="tel" value={personalData.phone} onChange={(e) => setPersonalData({...personalData, phone: e.target.value})} placeholder="(11) 99999-9999" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
        </div>
      </section>

      {/* ENTREGA */}
      <section className="bg-surface border border-white/10 rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-6">Endereço de Entrega</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-text-muted mb-1">CEP {loadingCep && <span className="text-accent text-xs ml-2 animate-pulse">Buscando...</span>}</label>
            <input required type="text" maxLength={9} value={address.cep} onChange={handleCepChange} placeholder="00000-000" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-muted mb-1">Rua / Avenida</label>
            <input required type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Nome da rua" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Número</label>
            <input required type="text" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="123" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-muted mb-1">Complemento & Bairro</label>
            <div className="flex gap-2">
              <input type="text" value={address.complement} onChange={(e) => setAddress({...address, complement: e.target.value})} placeholder="Apto, Bloco" className="w-1/2 bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
              <input required type="text" value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} placeholder="Bairro" className="w-1/2 bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
             <label className="block text-sm font-medium text-text-muted mb-1">Cidade</label>
             <input required type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Sua Cidade" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
          </div>
          <div className="col-span-1 md:col-span-1">
             <label className="block text-sm font-medium text-text-muted mb-1">Estado (UF)</label>
             <input required type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})} placeholder="SP" maxLength={2} className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent transition-all" />
          </div>
        </div>
      </section>

      {/* PAGAMENTO */}
      <section className="bg-surface border border-white/10 rounded-2xl p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Pagamento
          </h2>
          <div className="flex gap-1 text-text-muted">
            <Lock className="w-4 h-4 text-green-500" />
            <span className="text-xs">SSL 256-bit</span>
          </div>
        </div>

        {/* Toggles de Pagamento */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            type="button" 
            onClick={() => { setPaymentMethod("cartao"); handlePaymentInteraction(); }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cartao' ? 'border-accent bg-accent/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
          >
            <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'cartao' ? 'text-accent' : 'text-text-muted'}`} />
            <span className="font-bold">Cartão (até 12x)</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => { setPaymentMethod("pix"); handlePaymentInteraction(); }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'pix' ? 'border-green-400 bg-green-400/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
          >
            <svg className={`w-6 h-6 mb-2 ${paymentMethod === 'pix' ? 'text-green-400' : 'text-text-muted'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.996 1.401L2.016 7.39V16.63L11.996 22.599L21.984 16.63V7.39L11.996 1.401ZM11.996 21.054L3.388 15.864V8.156L11.996 2.946L20.612 8.156V15.864L11.996 21.054Z" />
              <path d="M7.788 11.233L10.596 8.425L11.996 9.825L9.188 12.633L7.788 11.233Z" />
              <path d="M16.204 11.233L13.396 8.425L11.996 9.825L14.804 12.633L16.204 11.233Z" />
              <path d="M11.996 14.033L14.804 11.225L13.404 9.825L10.596 12.633L11.996 14.033Z" />
              <path d="M7.788 12.633L10.596 15.441L11.996 14.041L9.188 11.233L7.788 12.633Z" />
              <path d="M16.204 12.633L13.396 15.441L11.996 14.041L14.804 11.233L16.204 12.633Z" />
            </svg>
            <span className="font-bold text-green-400">Pix (Ganhe 5% OFF)</span>
          </button>
        </div>

        {paymentMethod === "cartao" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
            <div className="col-span-1 md:col-span-4">
              <label className="block text-sm font-medium text-text-muted mb-1">Número do Cartão</label>
              <div className="relative">
                <input required type="text" value={cardData.number} onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})} onFocus={handlePaymentInteraction} placeholder="0000 0000 0000 0000" className="w-full bg-body border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text focus:outline-none focus:border-accent" />
                <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-text-muted" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Nome no Cartão</label>
              <input required type="text" value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})} placeholder="Como impresso no cartão" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Validade (MM/YY)</label>
              <input required type="text" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})} placeholder="MM/AA" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">CVV</label>
              <div className="relative">
                <input required type="text" maxLength={4} value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, "")})} placeholder="123" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
                <Lock className="w-4 h-4 absolute right-3 top-3.5 text-text-muted opacity-50" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-4 mt-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Parcelas</label>
              <select value={cardData.installments} onChange={(e) => setCardData({...cardData, installments: e.target.value})} className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent appearance-none">
                <option value="1" className="bg-neutral-900 text-white">À vista com desconto extra</option>
                <option value="3" className="bg-neutral-900 text-white">3x sem juros (Recomendado)</option>
                <option value="6" className="bg-neutral-900 text-white">6x sem juros</option>
                <option value="12" className="bg-neutral-900 text-white">12x no cartão</option>
              </select>
            </div>
            {paymentError && (
              <div className="col-span-1 md:col-span-4 mt-2 bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-500 text-sm font-bold text-center">
                {paymentError}
              </div>
            )}
          </div>
        )}

        {paymentMethod === "pix" && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex flex-col items-center justify-center py-8 animate-fade-in text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.996 1.401L2.016 7.39V16.63L11.996 22.599L21.984 16.63V7.39L11.996 1.401ZM11.996 21.054L3.388 15.864V8.156L11.996 2.946L20.612 8.156V15.864L11.996 21.054Z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 text-green-400">Desconto de 5% Aplicado!</h3>
            <p className="text-sm text-text-muted max-w-[280px]">
              O código Copia/Cola e QR Code serão gerados no próximo passo, instantaneamente.
            </p>
          </div>
        )}
      </section>

      {/* ORDER BUMP - ALTA CONVERSÃO */}
      <div className={`p-5 rounded-xl border-2 transition-all shadow-lg overflow-hidden relative cursor-pointer ${hasOrderBump ? 'bg-accent/10 border-accent' : 'bg-surface border-white/10 hover:border-white/30'}`} onClick={() => setHasOrderBump(!hasOrderBump)}>
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-bl-lg z-10">
          Super Oferta
        </div>
        
        <div className="flex gap-4">
          <div className="pt-1 pointer-events-none">
            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${hasOrderBump ? 'bg-accent border-accent text-black' : 'border-white/20 bg-black/50'}`}>
              {hasOrderBump && <ShieldCheck className="w-4 h-4" />}
            </div>
          </div>
          
          <div className="flex-1 pointer-events-none">
            <h3 className="font-bold text-lg text-white mb-1">
              Blindagem Premium: Garantia Estendida de <span className="text-accent underline decoration-accent/50 underline-offset-2">1 Ano</span>
            </h3>
            <p className="text-sm text-text-muted mb-2 leading-relaxed">
              Mantenha-se protegido contra QUALQUER defeito, quebra acidental ou mal funcionamento por 12 meses. Troca imediata e frete grátis por nossa conta.
            </p>
            <p className="font-bold">
              Sim, adicionar por apenas <span className="text-accent text-lg">R$ {orderBumpPrice.toFixed(2).replace(".", ",")}</span>
            </p>
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <button 
        type="submit"
        disabled={isProcessing}
        className={`w-full bg-accent hover:bg-accent-hover text-black font-black text-xl py-6 rounded-2xl flex justify-center items-center gap-2 shadow-[0_0_40px_rgba(251,191,36,0.2)] transition-all ${isProcessing ? 'opacity-80 cursor-wait' : 'hover:shadow-[0_0_60px_rgba(251,191,36,0.4)] hover:scale-[1.01]'}`}
      >
        <Lock className="w-5 h-5" />
        {isProcessing ? "PROCESSANDO SEGURANÇA..." : "FINALIZAR COMPRA SEGURA"}
      </button>

      {/* Trust footers under button */}
      <div className="flex items-center justify-center flex-wrap gap-6 mt-1 text-white/50 hover:text-white/80 transition-all">
        {/* Mastercard Inline SVG */}
        <svg viewBox="0 0 1000 600" className="h-6 opacity-60 grayscale hover:grayscale-0 transition-all" aria-label="Mastercard">
          <circle cx="350" cy="300" r="250" fill="#ea001b"/>
          <circle cx="650" cy="300" r="250" fill="#ffa200"/>
          <path d="M500,100 A250,250 0 0,0 500,500 A250,250 0 0,0 500,100 Z" fill="#ff5f00"/>
        </svg>

        {/* Visa Inline SVG */}
        <svg viewBox="0 0 32 10" className="h-3.5 opacity-60 grayscale hover:grayscale-0 transition-all" aria-label="Visa">
          <path fill="currentColor" d="M14.49 0l-1.95 9.77H9.55l3.05-9.77h2.89zm17.3 9.77h-3.05l-1.17-5.59-3.2 5.59h-2.92l4.49-9.77h3.05l2.22 8.35L30.12 0H33l-1.21 9.77zM10.15 0l-3.2 6.55L6.44 1.5A1.56 1.56 0 005 0H0v.48c1.33.27 2.8.84 3.73 1.4L6.96 9.77h3.05L13.16 0h-3zM23.6 5.37c0-2.31-3.23-2.43-3.23-3.48 0-.31.28-.65.98-.75.39-.06 1.48-.1 2.54.39L24.32.12c-.57-.25-1.42-.5-2.52-.5-2.88 0-4.91 1.54-4.93 3.75-.02 1.63 1.46 2.54 2.56 3.08 1.13.56 1.51.92 1.51 1.42 0 .77-.92 1.12-1.78 1.12-1.2 0-1.88-.17-2.88-.61L15.82 9.8c.62.29 1.77.55 2.97.55 3.05 0 5.06-1.5 5.06-3.83 0-1.28-.88-2.27-2.48-3.03l-.06-.02z"/>
        </svg>

        {/* Pix Inline SVG */}
        <div className="flex items-center gap-1 opacity-60 grayscale hover:grayscale-0 transition-all text-[#32BCAD]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
            <path d="M11.996 1.401L2.016 7.39V16.63L11.996 22.599L21.984 16.63V7.39L11.996 1.401ZM11.996 21.054L3.388 15.864V8.156L11.996 2.946L20.612 8.156V15.864L11.996 21.054Z" />
            <path d="M7.788 11.233L10.596 8.425L11.996 9.825L9.188 12.633L7.788 11.233Z" />
            <path d="M16.204 11.233L13.396 8.425L11.996 9.825L14.804 12.633L16.204 11.233Z" />
            <path d="M11.996 14.033L14.804 11.225L13.404 9.825L10.596 12.633L11.996 14.033Z" />
            <path d="M7.788 12.633L10.596 15.441L11.996 14.041L9.188 11.233L7.788 12.633Z" />
            <path d="M16.204 12.633L13.396 15.441L11.996 14.041L14.804 11.233L16.204 12.633Z" />
          </svg>
          <span className="font-bold text-sm tracking-tighter">pix</span>
        </div>
      </div>

    </form>
  );
}
