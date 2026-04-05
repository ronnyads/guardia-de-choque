"use client";

import { useState } from "react";
import { Zap, AlertCircle } from "lucide-react";

interface Props {
  upsellPrice: number;
  onDecision: (accepted: boolean) => void;
}

export default function UpsellModal({ upsellPrice, onDecision }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAction = (accepted: boolean) => {
    setLoading(true);
    setTimeout(() => {
      onDecision(accepted);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-surface border border-accent/30 rounded-3xl max-w-xl w-full flex flex-col max-h-[95vh] p-1 overflow-hidden animate-fade-in shadow-[0_0_100px_rgba(251,191,36,0.15)]">
        
        {/* Progress bar fake indicando que a compra tá em 80% */}
        <div className="h-2 w-full bg-white/5 rounded-t-3xl overflow-hidden relative">
           <div className="absolute top-0 left-0 bottom-0 bg-accent w-[85%] animate-[shimmer_2s_infinite]"></div>
        </div>

        <div className="p-4 md:p-6 lg:p-8 relative overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="flex items-center justify-center gap-2 text-accent font-bold uppercase tracking-widest text-xs mb-4">
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span className="text-center">Atenção! Seu pedido não está completo</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-6 leading-tight">
            NÃO FECHE ESSA PÁGINA <br/> 
            <span className="text-lg md:text-2xl font-normal text-text-muted mt-2 block">
              Leia essa mensagem com muita atenção.
            </span>
          </h2>

          <div className="bg-black/50 border border-white/5 rounded-2xl p-4 md:p-6 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[50px]"></div>
            
            <p className="text-text mb-4 text-left leading-relaxed">
              Recebemos aqui o seu pedido com sucesso. Mas antes de finalizarmos, notamos que 91% dos nossos clientes se arrependem de não comprar uma <strong>unidade extra de Backup</strong> para deixar no carro ou no trabalho.
            </p>
            <p className="text-white font-bold mb-4 text-left leading-relaxed">
              Como você já pagou o frete no primeiro kit, eu consegui liberar uma condição que você nunca mais vai ver:
            </p>

            <div className="bg-gradient-to-r from-accent/20 to-transparent border-l-4 border-accent p-4 text-left rounded-r-lg inline-block w-full mt-2">
              <span className="block text-accent font-black text-2xl mb-1">
                Leve +1 Guardiã Reserva
              </span>
              <span className="block text-white">Por apenas <strong className="text-xl">R$ {upsellPrice.toFixed(2).replace(".", ",")}</strong> (Preço de custo!)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => handleAction(true)}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-black font-black text-lg py-5 rounded-2xl flex justify-center items-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-black" />
                  SIM! ADICIONAR COM DESCONTO
                </>
              )}
            </button>
            <button 
              onClick={() => handleAction(false)}
              disabled={loading}
              className="w-full text-center py-4 text-sm text-text-muted hover:text-white underline decoration-white/20 hover:decoration-white transition-colors"
            >
              Não, obrigado. Quero correr o risco e ficar só com meu pedido original.
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
