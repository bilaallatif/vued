import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { BaseRoute } from "./components/base.tsx";
import { LoginRoute } from "./components/login.tsx";
import { client } from "@vued/sdk/api/client.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { HomeRoute } from "./components/home.tsx";

const routeTree = BaseRoute.addChildren([LoginRoute, HomeRoute]);
const router = createRouter({ routeTree });

const apiUrl: string = import.meta.env.VITE_API_URL;
client.setConfig({
  baseUrl: apiUrl,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
