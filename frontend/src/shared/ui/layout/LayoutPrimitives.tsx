import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("space-y-6", className)} {...props} />;
}

export function Stack({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function Inline({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}

export function ResponsiveGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    />
  );
}
