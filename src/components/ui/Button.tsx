import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  pulse = false,
  className = "",
  onClick,
}: Props) {
  const base = "inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-300 rounded-xl cursor-pointer hover:scale-[1.03] active:scale-[0.98]";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-black shadow-lg shadow-accent/20 border-b-4 border-black/10 active:border-b-0 translate-y-[-2px] active:translate-y-[0px] hover:translate-y-[-4px]",
    secondary: "bg-white/5 border-2 border-white/10 hover:bg-white/15 hover:border-accent hover:text-accent text-white shadow-xl translate-y-[-2px] hover:translate-y-[-4px]",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${
    pulse ? "animate-pulse-glow" : ""
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
