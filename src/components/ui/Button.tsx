"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children, href, variant = "primary", size = "md",
  pulse = false, className = "", onClick, disabled = false, type = "button",
}: Props) {
  const base = [
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-full cursor-pointer select-none",
    "transition-colors duration-200",
    "hover:opacity-90 active:scale-[0.98]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]",
    disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
  ].join(" ");

  const variants = {
    primary:   "bg-[#111111] text-white hover:bg-[#333333]",
    secondary: "bg-white text-[#111111] border border-gray-200 hover:border-gray-400",
    ghost:     "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#111111]",
    danger:    "bg-[#E53E3E] text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  const classes = [base, variants[variant], sizes[size], className, pulse ? "animate-pulse" : ""].filter(Boolean).join(" ");

  if (href && !disabled) {
    return <Link href={href} className={classes} onClick={onClick}>{children}</Link>;
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled} type={type} aria-disabled={disabled}>
      {children}
    </button>
  );
}
