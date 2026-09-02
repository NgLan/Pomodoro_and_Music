import { CircleAlert, Inbox, SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Skeleton } from "@/shared/ui/skeleton";

interface StateProps {
  action?: ReactNode;
  className?: string;
  description: ReactNode;
  title: ReactNode;
}

function StateFrame({
  action,
  className,
  description,
  icon,
  title,
}: StateProps & { icon: ReactNode }) {
  return (
    <div
      className={cn(
        "neo-surface bg-surface flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center",
        className,
      )}
    >
      <div className="border-border bg-accent-yellow grid size-14 place-items-center rounded-full border-2">
        {icon}
      </div>
      <div className="max-w-md space-y-2">
        <h3>{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function LoadingState({
  className,
  description,
  title,
}: Omit<StateProps, "action">) {
  return (
    <div
      className={cn("neo-surface bg-surface space-y-5 p-6", className)}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">
        {title}. {description}
      </span>
      <Skeleton className="border-border h-7 w-2/5 border-2" />
      <Skeleton className="border-border h-4 w-4/5 border-2" />
      <Skeleton className="border-border h-28 w-full border-2" />
    </div>
  );
}

export function EmptyState(props: StateProps) {
  return <StateFrame icon={<Inbox aria-hidden="true" />} {...props} />;
}

export function ErrorState(props: StateProps) {
  return <StateFrame icon={<CircleAlert aria-hidden="true" />} {...props} />;
}

export function NotFoundState(props: StateProps) {
  return <StateFrame icon={<SearchX aria-hidden="true" />} {...props} />;
}
