import { createRoute, Link, redirect } from "@tanstack/react-router";
import { BaseRoute } from "../base.tsx";
import { BaseLayout } from "../../components/base_layout.tsx";

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

const BaseAuthenticated = () => {
  const context = BaseRoute.useRouteContext();

  return (
    <BaseLayout>
      <div
        // Adding artificial space to center navbar
        className={
          "w-full flex flex-row items-center gap-10 bg-neutral-100/5 py-5 px-10"
        }
      >
        <div
          className={
            "animate-slide flex-1 text-yellow-600 tracking-widest font-bold text-5xl flex justify-start"
          }
        >
          VUE'D
        </div>
        <div
          className={
            "animate-fade flex-1 flex flex-row justify-center items-center gap-10"
          }
        >
          <NavbarLink to={"/home"} text={"Home"} />
          <NavbarLink to={"/users"} text={"Users"} />
          <NavbarLink to={"/profile"} text={"Profile"} />
        </div>
        <div
          className={
            "animate-fade flex-1 text-yellow-600 text-3xl flex justify-end"
          }
        >
          <button
            onClick={async () => {
              await context.auth.logout();
            }}
            className={"hover:text-yellow-500"}
          >
            Logout
          </button>
        </div>
      </div>
    </BaseLayout>
  );
};

export const AuthenticatedLayoutRoute = createRoute({
  getParentRoute: () => BaseRoute,
  id: "_authenticated_base",
  component: BaseAuthenticated,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});
