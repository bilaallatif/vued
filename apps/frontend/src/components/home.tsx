import { createRoute, redirect } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";

const Home = () => {
  const navigate = BaseRoute.useNavigate();

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>Authenticated</h1>
      <button
        className={"text-5xl text-neutral-400"}
        onClick={async () => {
          await navigate({ to: "/login" });
        }}
      >
        BACK
      </button>
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "home",
  component: Home,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});
