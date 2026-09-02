import * as React from "react";

import { cn } from "@/shared/lib/cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-surface-blue placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-disabled aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex field-sizing-content min-h-24 w-full rounded-md border-2 px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-70 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
