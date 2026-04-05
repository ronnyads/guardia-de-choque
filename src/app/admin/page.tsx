"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingCart, Target } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    funnels: 0,
    orders: 0
  });
  
  useEffect(() => {
    async function loadStats() {
      // Basic counts
      const [productsRes, funnelsRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("upsell_rules").select("id", { count: "exact", head: true }),
      ]);
      
      setStats({
        products: productsRes.count || 0,
        funnels: funnelsRes.count || 0,
        orders: 0 // to implement via orders table soon
      });
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Visão Geral</h1>
        <p className="text-[#64748B] text-sm">Acompanhe as métricas e o funil da da operação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Produtos Ativos</span>
            <Package className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{stats.products}</span>
        </div>
        
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Regras de Funil (Upsell)</span>
            <Target className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{stats.funnels}</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-[#475569]">
            <span className="font-semibold text-sm">Pedidos (Geral)</span>
            <ShoppingCart className="w-5 h-5 text-[#0F172A]" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">{stats.orders}</span>
        </div>
      </div>
    </div>
  );
}
