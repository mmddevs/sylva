"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/theme/theme";

/* Sonner suit le thème du site ; ses couleurs viennent des tokens. */
export function AppToaster() {
  const theme = useTheme();
  return (
    <Toaster
      theme={theme ?? "light"}
      position="bottom-center"
      offset={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-lg !border !border-border !bg-card !text-card-foreground !shadow-lift !font-sans",
          description: "!text-muted-foreground",
          icon: "!text-primary",
        },
      }}
    />
  );
}
