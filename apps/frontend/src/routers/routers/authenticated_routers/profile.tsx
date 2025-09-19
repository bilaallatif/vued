import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";

const Profile = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>Profile</h1>
    </div>
  );
};

export const ProfileRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "profile",
  component: Profile,
});
