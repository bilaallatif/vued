import { createRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { BaseRoute } from "../base.tsx";

interface NavbarLinkProps {
  to: string;
  text: string;
}

const NavbarLink = ({ to, text }: NavbarLinkProps) => {
  return (
    <Link
      to={to}
      className={"text-yellow-600 text-3xl"}
      activeProps={{ className: "!text-yellow-500" }}
    >
      {text}
    </Link>
  );
};

const Navbar = () => {
  return (
    <div className={"w-full h-full flex flex-col"}>
      <div
        className={"flex-1 flex flex-row justify-center items-center gap-10"}
      >
        <NavbarLink to={"/home"} text={"Home"} />
        <NavbarLink to={"/users"} text={"Users"} />
        <NavbarLink to={"/profile"} text={"Profile"} />
      </div>
      <div className={"flex-10"}>
        <Outlet />
      </div>
    </div>
  );
};

export const NavbarRoute = createRoute({
  getParentRoute: () => BaseRoute,
  id: "_navbar",
  component: Navbar,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});
