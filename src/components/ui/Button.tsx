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
  const base = "inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-200 rounded-xl cursor-pointer";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-black",
    secondary: "border-2 border-white/20 hover:border-accent text-white hover:text-accent",
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
