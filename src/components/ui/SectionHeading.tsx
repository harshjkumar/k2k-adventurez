import { ReactNode } from "react";

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  children?: ReactNode;
}

export function SectionHeading({
  overline,
  title,
  subtitle,
  align = "center",
  light = false,
  children,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const textColor = light ? "text-white" : "text-charcoal";
  const subtitleColor = light ? "text-white/70" : "text-warm-gray";
  const overlineColor = light ? "text-white/60" : "text-accent";

  return (
    <div className={`${alignClass} max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      {overline && (
        <p className={`text-xs font-medium uppercase tracking-[0.25em] ${overlineColor} mb-4`}>
          {overline}
        </p>
      )}
      <h2
        className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base lg:text-lg ${subtitleColor} leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
