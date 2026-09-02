import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-bold whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:bg-disabled disabled:text-muted-foreground disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "neo-interactive border-2 border-border bg-primary text-primary-foreground shadow-neo hover:bg-primary-hover",
        destructive:
          "neo-interactive border-2 border-border bg-destructive text-surface shadow-neo hover:brightness-95 focus-visible:ring-destructive/20",
        outline:
          "neo-interactive border-2 border-border bg-surface text-foreground shadow-neo hover:bg-accent",
        secondary:
          "neo-interactive border-2 border-border bg-secondary text-secondary-foreground shadow-neo hover:brightness-95",
        ghost:
          "border-2 border-transparent hover:border-border hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline decoration-2 underline-offset-4 hover:bg-accent",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 rounded-md px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-md px-7 has-[>svg]:px-5",
        icon: "size-11",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
