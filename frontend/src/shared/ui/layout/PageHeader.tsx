import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-muted-foreground text-sm font-bold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1>{title}</h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
