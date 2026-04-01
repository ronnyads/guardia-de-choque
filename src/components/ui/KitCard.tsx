import { motion } from "framer-motion";
import { Check, Gift, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { Kit } from "@/types";
import { getCheckoutUrl } from "@/lib/checkout";

interface Props {
  kit: Kit;
  index: number;
}

export default function KitCard({ kit, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative flex flex-col rounded-2xl border p-6 md:p-8 ${
        kit.highlighted
          ? "border-accent/50 bg-surface shadow-[0_0_50px_rgba(245,158,11,0.2)] scale-[1.02] md:scale-105"
          : "border-white/10 bg-surface shadow-lg shadow-black/20"
      }`}
    >
      {/* Badge */}
      {kit.badge && (
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
            kit.highlighted
              ? "bg-accent text-black"
              : "bg-white/10 text-white"
          }`}
        >
          {kit.badge}
        </div>
      )}

      <div className="flex flex-col items-center text-center gap-5 flex-1">
        {/* Kit name */}
        <h3 className="text-xl font-bold mt-2">{kit.name}</h3>

        {/* Items */}
        <ul className="flex flex-col gap-2 text-sm text-text-secondary w-full">
          {kit.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Bonus */}
        {kit.bonus && (
          <div className="w-full bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="text-xs text-accent font-bold">BÔNUS GRÁTIS</p>
              <p className="text-sm text-white font-semibold">{kit.bonus.name}</p>
              <p className="text-xs text-text-muted">
                Valor: R$ {kit.bonus.value.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex flex-col items-center gap-1 mt-auto pt-4">
          <span className="text-sm text-text-muted line-through">
            De R$ {kit.originalPrice.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-accent">
            R$ {kit.promoPrice.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-xs text-text-secondary">
            ou {kit.installments.count}x de R${" "}
            {kit.installments.value.toFixed(2).replace(".", ",")} sem juros
          </span>
          <span className="mt-1 inline-flex items-center gap-1 bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full">
            Economize R$ {kit.savings.toFixed(2).replace(".", ",")} ({kit.savingsPercent}%)
          </span>
          <span className="text-xs text-accent font-semibold mt-1">
            5% OFF no PIX: R$ {kit.pixPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>

        {/* CTA */}
        <Button
          href={getCheckoutUrl(kit.slug)}
          onClick={() => {
            if (typeof window !== "undefined" && window.fbq) {
              window.fbq("track", "InitiateCheckout", {
                content_name: kit.name,
                currency: "BRL",
                value: kit.promoPrice,
              });
            }
          }}
          variant={kit.highlighted ? "primary" : "secondary"}
          size="md"
          pulse={kit.highlighted}
          className="w-full mt-2"
        >
          <Zap className="w-4 h-4" />
          {kit.highlighted ? "GARANTIR KIT DUPLA" : `COMPRAR ${kit.name.toUpperCase()}`}
        </Button>

        {kit.quantity > 1 && (
          <p className="text-xs text-text-muted">
            Apenas R$ {kit.perUnit.toFixed(2).replace(".", ",")} por unidade
          </p>
        )}
      </div>
    </motion.div>
  );
}
