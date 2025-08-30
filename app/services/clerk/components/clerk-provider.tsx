"use client";

import { ReactNode, Suspense } from "react";

import { dark } from "@clerk/themes";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";

export function ClerkProvidre({ children }: { children: ReactNode }) {
  const isDarkMode = useIsDarkMode();

  return (
    <Suspense>
      <OriginalClerkProvider
        appearance={isDarkMode ? { theme: [dark] } : undefined}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
}
