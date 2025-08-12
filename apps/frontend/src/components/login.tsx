import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";

const Login = () => {
  return <h1>Login</h1>;
};

export const LoginRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "login",
  component: Login,
});
