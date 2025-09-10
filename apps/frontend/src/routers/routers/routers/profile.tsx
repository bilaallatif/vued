import { createRoute } from "@tanstack/react-router";
import { NavbarRoute } from "../navbar.tsx";

const Profile = () => {
  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>Profile</h1>
    </div>
  );
};

export const ProfileRoute = createRoute({
  getParentRoute: () => NavbarRoute,
  path: "profile",
  component: Profile,
});
