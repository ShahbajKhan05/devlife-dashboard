import type { ReactNode } from "react";

export function PageLayout({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-7 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#80631F]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-6 text-[#625D4C] sm:text-base">
        {description}
      </p>
    </header>
  );
}
