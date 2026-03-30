"use client";

import { motion } from "framer-motion";
import ScrollSnapSection from "@/components/layout/ScrollSnapSection";
import AccordionItem from "@/components/ui/AccordionItem";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQSection() {
  return (
    <ScrollSnapSection noSnap>
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center gap-8 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center"
        >
          Perguntas <span className="text-accent">Frequentes</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </motion.div>
      </div>
    </ScrollSnapSection>
  );
}
