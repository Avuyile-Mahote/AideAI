import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full glass text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-3">
            {Icon && <Icon className="h-3 w-3 text-primary" />}
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
