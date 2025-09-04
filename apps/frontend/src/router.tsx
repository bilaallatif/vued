import { BaseRoute } from "./components/base.tsx";
import { LoginRoute } from "./components/login.tsx";
import { HomeRoute } from "./components/home.tsx";
import { createRouter } from "@tanstack/react-router";
import { useEffect } from "react";

// const CatchRoute = createRoute({
//   getParentRoute: () => BaseRoute,
//   path: "/*",
//   loader: () => {
//     console.log("Catch Route");
//     throw redirect({ to: "/home" });
//   },
// });

const NotFoundRedirect = () => {
  const navigate = BaseRoute.useNavigate();

  useEffect(() => {
    navigate({ to: "/home" });
  }, []);

  return <div>Redirecting...</div>;
};

const routeTree = BaseRoute.addChildren([LoginRoute, HomeRoute]);
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
