import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";

const Home = () => {
  return <h1>Home</h1>;
};

export const HomeRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "home",
  component: Home,
});
