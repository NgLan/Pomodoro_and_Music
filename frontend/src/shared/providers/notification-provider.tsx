"use client";

import type { ReactNode } from "react";

import { Toaster } from "@/shared/ui/sonner";

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
