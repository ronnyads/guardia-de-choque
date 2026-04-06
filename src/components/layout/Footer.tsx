'use client';

import { Zap } from "lucide-react";
import { useStoreConfig } from "@/components/providers/TenantProvider";

export default function Footer() {
  const config = useStoreConfig();
  const brandName = config.brand_name ?? 'Minha Loja';

  return (
    <footer className="bg-[#050505] border-t border-white/5 px-6 md:px-12 lg:px-24 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              {brandName}<span className="text-accent">.</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-gray-400 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contato
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} {brandName}. Todos os direitos reservados.
          </p>
          <p className="text-text-muted text-[10px] mt-2">
            Este produto não é classificado como arma de fogo. Uso permitido para civis conforme legislação brasileira.
          </p>
        </div>
      </div>
    </footer>
  );
}
