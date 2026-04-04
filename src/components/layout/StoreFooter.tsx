import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, Phone } from "lucide-react";

export default function StoreFooter() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Os Oliveiras
            </span>
            <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-xs">
              Produtos selecionados com o cuidado que só uma família pode oferecer.
            </p>

            {/* Contact */}
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden />
              <span>(87) 99999-9944</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">contato@oliveiras.com</p>
          </div>

          {/* Informações */}
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Informações</p>
            <ul className="space-y-2.5" role="list">
              {[
                { href: "/sobre",    label: "Quem somos"      },
                { href: "/rastreio", label: "Rastrear pedido" },
                { href: "/loja",     label: "Nossa loja"      },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Políticas</p>
            <ul className="space-y-2.5" role="list">
              {[
                "Política de privacidade",
                "Política de trocas",
                "Termos de uso",
              ].map((l) => (
                <li key={l}>
                  <span className="text-sm text-gray-500">{l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Formas de pagamento */}
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Formas de Pagamento</p>
            <div className="flex flex-wrap gap-2">
              {["PIX", "Visa", "Master", "Boleto", "Elo"].map((p) => (
                <span
                  key={p}
                  className="bg-white/10 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-white">Loja Verificada</p>
                <p className="text-[10px] text-gray-400">Compra 100% segura</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2025 Os Oliveiras. Todos os direitos reservados.</p>
          <p className="text-xs text-gray-500">Produto legal no Brasil · Entrega nacional</p>
        </div>
      </div>
    </footer>
  );
}
