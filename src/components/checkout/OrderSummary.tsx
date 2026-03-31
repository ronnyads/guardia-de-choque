import { ShieldCheck, Truck, Lock, Clock } from "lucide-react";
import { Kit } from "@/types";
import { useEffect, useState } from "react";

interface Props {
  kit: Kit;
  hasOrderBump: boolean;
  orderBumpPrice: number;
  total: number;
}

export default function OrderSummary({ kit, hasOrderBump, orderBumpPrice, total }: Props) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
      {/* Urgency Trigger */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3">
        <Clock className="w-5 h-5 text-red-500 animate-pulse" />
        <p className="text-sm font-medium text-red-100">
          Seu carrinho expira em: <strong className="text-red-400 text-base">{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</strong>
        </p>
      </div>

      <h3 className="font-bold text-lg border-b border-white/10 pb-4">Resumo do Pedido</h3>
      
      {/* Kit Info */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
        <div>
          <p className="font-bold text-base">{kit.name}</p>
          <p className="text-sm text-text-muted">{kit.quantity}x unidades completas</p>
        </div>
        <p className="font-bold text-lg">R$ {kit.promoPrice.toFixed(2).replace(".", ",")}</p>
      </div>

      {hasOrderBump && (
        <div className="flex justify-between items-center bg-accent/10 border border-accent/20 p-4 rounded-xl text-accent animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
          <div>
            <p className="font-bold text-sm flex items-center gap-1">+ Garantia Premium</p>
            <p className="text-xs opacity-80">1 ano de blindagem total</p>
          </div>
          <p className="font-bold text-sm">R$ {orderBumpPrice.toFixed(2).replace(".", ",")}</p>
        </div>
      )}

      {/* Totals */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm text-text-muted">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2).replace(".", ",")}</span>
        </div>
        <div className="flex justify-between text-sm text-green-400 font-medium">
          <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Frete Expresso BR</span>
          <span>GRÁTIS</span>
        </div>
        <div className="flex justify-between items-end mt-3 border-t border-white/5 pt-5">
          <span className="font-bold text-lg text-text">Total</span>
          <div className="text-right">
            <span className="text-3xl font-black text-accent drop-shadow-md">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex gap-3 text-sm">
        <ShieldCheck className="w-8 h-8 text-green-500 shrink-0" />
        <div>
          <p className="font-bold text-green-400">Risco Zero - Garantia de 30 Dias</p>
          <p className="text-text-muted text-xs mt-1">Se não superar expectativas, devolvemos 100% do seu pagamento.</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-text-muted mt-2 opacity-80">
        <Lock className="w-3 h-3" />
        <span>Checkout 100% seguro (criptografia SSL 256-bit)</span>
      </div>
    </div>
  );
}
