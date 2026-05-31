import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition duration-200",
        "focus:outline-none focus:ring-4 focus:ring-blue-200",
        variant === "primary" && "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700",
        variant === "light" && "bg-white text-blue-700 shadow-lg shadow-blue-950/10 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Link>
  );
}
