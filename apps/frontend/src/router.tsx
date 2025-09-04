import { BaseRoute } from "./components/base.tsx";
import { LoginRoute } from "./components/login.tsx";
import { HomeRoute } from "./components/home.tsx";
import { createRoute, createRouter, redirect } from "@tanstack/react-router";

const CatchRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "/",
  loader: () => {
    throw redirect({ to: "/home" });
  },
});

const routeTree = BaseRoute.addChildren([CatchRoute, LoginRoute, HomeRoute]);
export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
