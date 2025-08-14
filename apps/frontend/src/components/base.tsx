import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const Base = () => {
  return (
    <div className={"bg-amber-800"}>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};

export const BaseRoute = createRootRoute({
  component: Base,
});
