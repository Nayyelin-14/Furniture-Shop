import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";

import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "sonner";
import { queryClient } from "./api/query.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
