import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { client } from "@vued/sdk/api/client.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { AuthProvider } from "./auth.tsx";
import { App } from "./app.tsx";

const apiUrl: string = import.meta.env.VITE_API_URL;
client.setConfig({
  baseUrl: apiUrl,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
