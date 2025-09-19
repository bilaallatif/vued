import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";

const Users = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>Users</h1>
    </div>
  );
};

export const UsersRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "users",
  component: Users,
});
