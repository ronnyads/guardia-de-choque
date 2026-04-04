import Link from "next/link";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";

const shopLinks = [
  { href: "/loja",                      label: "Todos os Produtos"  },
  { href: "/categoria/defesa-pessoal",  label: "Defesa Pessoal"     },
  { href: "/sobre",                     label: "Nossa História"     },
];

const supportLinks = [
  { href: "/rastreio",         label: "Rastrear Pedido"     },
  { href: "mailto:contato@oliveiras.com", label: "Contato"  },
];

const trustItems = [
  { icon: ShieldCheck, label: "Compra garantida"   },
  { icon: Truck,       label: "Entrega em todo BR" },
  { icon: CreditCard,  label: "PIX · Cartão · Boleto" },
];

export default function StoreFooter() {
  return (
    <footer className="bg-surface border-t border-border">

      {/* Trust bar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm text-text-body">
                <Icon className="w-4 h-4 text-accent shrink-0" aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Os Oliveiras — início">
              <span
                className="text-2xl text-foreground"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
              >
                Os Oliveiras<span className="text-accent not-italic">.</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Produtos selecionados com o cuidado e a confiança que só uma família pode oferecer.
            </p>
          </div>

          {/* Loja */}
          <div>
            <p className="text-foreground font-semibold text-sm mb-4">Loja</p>
            <ul className="space-y-3" role="list">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <p className="text-foreground font-semibold text-sm mb-4">Suporte</p>
            <ul className="space-y-3" role="list">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © 2025 Os Oliveiras. Todos os direitos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Produto legal no Brasil · Entrega nacional
          </p>
        </div>
      </div>
    </footer>
  );
}
