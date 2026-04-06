'use client';

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Phone } from "lucide-react";
import { useStoreConfig } from "@/components/providers/TenantProvider";

export default function StoreFooter() {
  const config = useStoreConfig();
  const brandName = config.brand_name ?? 'Minha Loja';

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
              {brandName}
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
              {[
                { src: "/images/product/bandeiras/pix.png",       alt: "PIX",        w: 36, h: 36 },
                { src: "/images/product/bandeiras/visa.png",       alt: "Visa",       w: 48, h: 16 },
                { src: "/images/product/bandeiras/mastercard.png", alt: "Mastercard", w: 34, h: 26 },
                { src: "/images/product/bandeiras/elo.png",        alt: "Elo",        w: 36, h: 22 },
              ].map(({ src, alt, w, h }) => (
                <div key={alt} className="flex items-center justify-center bg-white rounded-lg px-2.5 py-1.5">
                  <Image src={src} alt={alt} width={w} height={h} className="object-contain" />
                </div>
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
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} {brandName}. Todos os direitos reservados.</p>
          <p className="text-xs text-gray-500">Produto legal no Brasil · Entrega nacional</p>
        </div>
      </div>
    </footer>
  );
}
