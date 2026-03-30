import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  noSnap?: boolean;
}

export default function ScrollSnapSection({ children, id, className = "", noSnap }: Props) {
  return (
    <section
      id={id}
      className={`${noSnap ? "min-h-screen" : "snap-section"} px-6 md:px-12 lg:px-24 ${className}`}
    >
      {children}
    </section>
  );
}
