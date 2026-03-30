"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Zap,
  BatteryCharging,
  Flashlight,
  ShieldCheck,
  Package,
  Scale,
} from "lucide-react";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import { MAIN_PRODUCT } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  BatteryCharging,
  Flashlight,
  ShieldCheck,
  Package,
  Scale,
};

export default function ProductShowcase() {
  return (
    <ScrollSnapSection className="bg-surface">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Product Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/5 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="/images/product/kit-completo.png"
                alt="Guardiã de Choque - Kit completo com coldre e cabo"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="grid grid-cols-2 gap-2">
                  {MAIN_PRODUCT.specs.slice(0, 4).map((spec) => (
                    <div
                      key={spec.label}
                      className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center"
                    >
                      <p className="text-[10px] text-text-muted">{spec.label}</p>
                      <p className="text-xs font-semibold">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Conheça a{" "}
              <span className="text-accent">Guardiã de Choque</span>
            </h2>
            <p className="text-text-secondary">
              16cm de tecnologia pensada para sua proteção
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MAIN_PRODUCT.features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Zap;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-background rounded-xl border border-white/10 p-5 flex gap-4 hover:border-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollSnapSection>
  );
}
