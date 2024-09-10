// src/components/QueryClientProviderWrapper.tsx
"use client"; // Ensures this is a client component

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../api/client";

export default function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
