"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  question: string;
  answer: string;
}

export default function AccordionItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-5 text-left cursor-pointer group rounded-lg px-2 transition-colors ${
          open ? "bg-white/5" : "hover:bg-white/5"
        }`}
      >
        <span className="text-base font-semibold pr-4 group-hover:text-accent transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-text-body text-sm leading-relaxed pb-5 px-2">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
