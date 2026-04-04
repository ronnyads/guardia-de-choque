"use client";

import { useState } from "react";
import { Search, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import StoreFooter from "@/components/layout/StoreFooter";

export default function RastreioPage() {
  const [code, setCode] = useState("");

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-xl mx-auto px-4 md:px-8 py-24 text-center">
          <div className="w-20 h-20 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-9 h-9 text-accent" />
          </div>
          <h1 className="text-3xl text-foreground mb-3">Rastrear Pedido</h1>
          <p className="text-text-secondary mb-8">
            Digite o código de rastreio recebido por e-mail para acompanhar seu pedido.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: BR123456789BR"
              className="flex-1 bg-surface border-2 border-border rounded-xl px-4 py-3 text-foreground placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <button
              className="bg-accent hover:bg-accent-hover text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rastrear
            </button>
          </div>

          <p className="text-text-muted text-sm mt-6">
            Ainda não recebeu o código? Entre em contato conosco pelo WhatsApp.
          </p>
        </div>
      </main>
      <StoreFooter />
    </>
  );
}
