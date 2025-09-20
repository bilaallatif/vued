import { BaseRoute } from "./routers/base.tsx";
import { LoginRoute } from "./routers/routers/login_routers/login.tsx";
import { HomeRoute } from "./routers/routers/authenticated_routers/home.tsx";
import { createRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthenticatedLayoutRoute } from "./routers/routers/authenticated_base.tsx";
import { UsersRoute } from "./routers/routers/authenticated_routers/users.tsx";
import { ProfileRoute } from "./routers/routers/authenticated_routers/profile.tsx";
import { LoginLayoutRoute } from "./routers/routers/login_base.tsx";
import { TestRoute } from "./routers/routers/authenticated_routers/test.tsx";

const NotFoundRedirect = () => {
  const navigate = BaseRoute.useNavigate();

  useEffect(() => {
    navigate({ to: "/home" });
  }, []);

  return <div>Redirecting...</div>;
};

const routeTree = BaseRoute.addChildren([
  LoginLayoutRoute.addChildren([LoginRoute]),
  AuthenticatedLayoutRoute.addChildren([
    HomeRoute,
    UsersRoute,
    ProfileRoute,
    TestRoute,
  ]),
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
