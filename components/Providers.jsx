"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border !border-base-300 !bg-base-100 !text-base-content !shadow-card-hover",
          title: "!font-semibold !text-sm",
          description: "!text-sm !text-muted-foreground",
          success: "!border-l-4 !border-l-success",
          error: "!border-l-4 !border-l-error",
          warning: "!border-l-4 !border-l-warning",
          info: "!border-l-4 !border-l-info",
        },
      }}
    />
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      value={{ light: "unitypulse-light", dark: "unitypulse-dark" }}
    >
      {children}
      <ThemedToaster />
    </ThemeProvider>
  );
}
