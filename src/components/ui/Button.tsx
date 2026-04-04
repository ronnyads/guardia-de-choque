import { ReactNode } from "react";

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
  children,
  href,
  variant = "primary",
  size = "md",
  pulse = false,
  className = "",
  onClick,
  disabled = false,
  type = "button",
}: Props) {
  const base = [
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide",
    "rounded-xl cursor-pointer select-none",
    "transition-all duration-200 ease-out",
    /* Hover lift — P2: 150-300ms micro-interaction */
    "hover:-translate-y-px active:translate-y-0",
    "active:scale-[0.98]",
    /* Focus visible — P1 accessibility (handled globally but reinforced) */
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
    disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
  ].join(" ");

  const variants = {
    /* Electric blue — trust + action */
    primary: [
      "bg-accent text-white",
      "hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/20",
      "active:bg-accent-dark",
      "border border-accent/20",
    ].join(" "),

    /* Outline — secondary actions */
    secondary: [
      "bg-transparent text-foreground",
      "border border-border hover:border-accent hover:text-accent",
      "hover:bg-accent/5",
    ].join(" "),

    /* Ghost — tertiary actions */
    ghost: [
      "bg-transparent text-text-body",
      "hover:bg-surface-elevated hover:text-foreground",
      "border border-transparent",
    ].join(" "),

    /* Danger */
    danger: [
      "bg-danger text-white",
      "hover:bg-danger/90 hover:shadow-lg hover:shadow-danger/20",
    ].join(" "),
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const classes = [
    base,
    variants[variant],
    sizes[size],
    pulse && !disabled ? "animate-pulse-glow" : "",
    className,
  ].filter(Boolean).join(" ");

  if (href && !disabled) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
