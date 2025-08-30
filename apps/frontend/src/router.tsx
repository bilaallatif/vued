import { BaseRoute } from "./components/base.tsx";
import { LoginRoute } from "./components/login.tsx";
import { HomeRoute } from "./components/home.tsx";
import { createRouter } from "@tanstack/react-router";

const routeTree = BaseRoute.addChildren([LoginRoute, HomeRoute]);
export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
