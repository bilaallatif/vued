import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthState } from "../auth.tsx";

const Base = () => <Outlet />;

interface BaseRouterContext {
  auth: AuthState;
}

export const BaseRoute = createRootRouteWithContext<BaseRouterContext>()({
  component: Base,
});
