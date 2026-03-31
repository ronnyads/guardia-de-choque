import { useState } from "react";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";

interface Props {
  onFinish: () => void;
  hasOrderBump: boolean;
  setHasOrderBump: (val: boolean) => void;
  orderBumpPrice: number;
}

export default function CheckoutForm({ onFinish, hasOrderBump, setHasOrderBump, orderBumpPrice }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao">("cartao");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish(); // Aciona o Upsell ou a tela final
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      
      {/* DADOS PESSOAIS */}
      <section className="bg-surface border border-white/10 rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Dados Pessoais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-muted mb-1">Nome Completo</label>
            <input required type="text" placeholder="Digite seu nome completo" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">E-mail</label>
            <input required type="email" placeholder="seu@email.com" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Celular / WhatsApp</label>
            <input required type="tel" placeholder="(11) 99999-9999" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-muted mb-1">CPF (Para Nota Fiscal e Garantia)</label>
            <input required type="text" placeholder="000.000.000-00" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
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
            onClick={() => setPaymentMethod("cartao")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cartao' ? 'border-accent bg-accent/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
          >
            <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'cartao' ? 'text-accent' : 'text-text-muted'}`} />
            <span className="font-bold">Cartão (até 12x)</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => setPaymentMethod("pix")}
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
                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-body border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text focus:outline-none focus:border-accent" />
                <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-text-muted" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Nome no Cartão</label>
              <input required type="text" placeholder="Como impresso no cartão" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">Validade (MM/YY)</label>
              <input required type="text" placeholder="MM/AA" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
            </div>
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-text-muted mb-1">CVV</label>
              <div className="relative">
                <input required type="text" placeholder="123" className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent" />
                <Lock className="w-4 h-4 absolute right-3 top-3.5 text-text-muted opacity-50" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-4 mt-2">
              <label className="block text-sm font-medium text-text-muted mb-1">Parcelas</label>
              <select className="w-full bg-body border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent appearance-none">
                <option>À vista com desconto extra</option>
                <option>3x sem juros (Recomendado)</option>
                <option>6x sem juros</option>
                <option>12x no cartão</option>
              </select>
            </div>
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
        className="w-full bg-accent hover:bg-accent-hover text-black font-black text-xl py-6 rounded-2xl flex justify-center items-center gap-2 shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:shadow-[0_0_60px_rgba(251,191,36,0.4)] transition-all transform hover:scale-[1.01]"
      >
        <Lock className="w-5 h-5" />
        FINALIZAR COMPRA SEGURA
      </button>

      {/* Trust footers under button */}
      <div className="flex justify-center flex-wrap gap-4 mt-[-10px]">
        <img src="https://logospng.org/wp-content/uploads/mastercard.png" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <img src="https://logospng.org/wp-content/uploads/visa.png" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
        <img src="https://logospng.org/wp-content/uploads/pix.png" alt="Pix" className="h-5 opacity-50 grayscale hover:grayscale-0 transition-all mt-0.5" />
      </div>

    </form>
  );
}
