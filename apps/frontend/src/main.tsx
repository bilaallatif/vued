import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { BaseRoute } from "./components/base.tsx";
import { LoginRoute } from "./components/login.tsx";

const routeTree = BaseRoute.addChildren([LoginRoute]);
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
