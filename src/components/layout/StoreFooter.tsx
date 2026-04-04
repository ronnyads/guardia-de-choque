import Link from "next/link";

export default function StoreFooter() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <span
              className="text-2xl text-foreground"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}
            >
              Os Oliveiras<span className="text-accent not-italic">.</span>
            </span>
            <p className="text-text-secondary mt-4 leading-relaxed max-w-xs">
              Qualidade que a família garante. Produtos selecionados com cuidado para
              você e sua família.
            </p>
            <div className="flex gap-4 mt-5">
              <span className="text-xs text-text-muted">PIX</span>
              <span className="text-xs text-text-muted">Cartão</span>
              <span className="text-xs text-text-muted">Boleto</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4">Loja</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/loja", label: "Todos os Produtos" },
                { href: "/categoria/defesa-pessoal", label: "Defesa Pessoal" },
                { href: "/sobre", label: "Nossa História" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-bold text-foreground text-sm mb-4">Suporte</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/rastreio", label: "Rastrear Pedido" },
                { href: "mailto:contato@oliveiras.com", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © 2025 Os Oliveiras. Todos os direitos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Produto legal no Brasil · Entrega para todo o território nacional
          </p>
        </div>
      </div>
    </footer>
  );
}
