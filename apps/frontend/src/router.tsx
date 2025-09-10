import { BaseRoute } from "./routers/base.tsx";
import { LoginRoute } from "./routers/routers/login.tsx";
import { HomeRoute } from "./routers/routers/routers/home.tsx";
import { createRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { NavbarRoute } from "./routers/routers/navbar.tsx";
import { UsersRoute } from "./routers/routers/routers/users.tsx";
import { ProfileRoute } from "./routers/routers/routers/profile.tsx";

const NotFoundRedirect = () => {
  const navigate = BaseRoute.useNavigate();

  useEffect(() => {
    navigate({ to: "/home" });
  }, []);

  return <div>Redirecting...</div>;
};

const routeTree = BaseRoute.addChildren([
  LoginRoute,
  NavbarRoute.addChildren([HomeRoute, UsersRoute, ProfileRoute]),
]);
export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultNotFoundComponent: NotFoundRedirect,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
