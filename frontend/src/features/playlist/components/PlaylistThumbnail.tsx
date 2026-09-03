"use client";

import { Music2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";

export function PlaylistThumbnail({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src?: string | null;
}) {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError)
    return (
      <div
        aria-label={alt}
        className={cn(
          "bg-accent-purple grid aspect-video place-items-center",
          className,
        )}
        role="img"
      >
        <span className="border-border bg-surface shadow-neo-sm grid size-16 -rotate-3 place-items-center rounded-full border-2">
          <Music2 aria-hidden="true" className="size-8" />
        </span>
      </div>
    );
  return (
    <Image
      alt={alt}
      className={cn("aspect-video object-cover", className)}
      height={360}
      onError={() => setHasError(true)}
      sizes="(max-width: 640px) 100vw, 360px"
      src={src}
      width={640}
    />
  );
}
