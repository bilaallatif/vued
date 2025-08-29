import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";

const Home = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>Authenticated</h1>
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "home",
  component: Home,
});
