import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureRowProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function FeatureRow({
  title,
  description,
  children,
  className,
}: FeatureRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 py-8 border-b border-slate-100 last:border-0",
        className,
      )}
    >
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500 leading-relaxed max-w-[200px]">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}
