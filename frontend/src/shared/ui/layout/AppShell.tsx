import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface AppShellProps extends ComponentProps<"div"> {
  header?: ReactNode;
  miniPlayer?: ReactNode;
  miniPlayerLabel?: string;
}

export function AppShell({
  children,
  className,
  header,
  miniPlayer,
  miniPlayerLabel,
  ...props
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-svh flex-col", className)} {...props}>
      {header ? (
        <header className="border-border bg-surface sticky top-0 z-(--z-sticky) border-b-3">
          {header}
        </header>
      ) : null}
      <main className="flex-1">{children}</main>
      {miniPlayer ? (
        <aside
          className="border-border bg-surface sticky bottom-0 z-(--z-sticky) border-t-3"
          aria-label={miniPlayerLabel}
        >
          {miniPlayer}
        </aside>
      ) : null}
    </div>
  );
}

export function PageContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--content-max-width) px-3 py-2 pb-16 sm:px-6 sm:py-3 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
