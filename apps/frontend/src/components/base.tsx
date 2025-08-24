import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const Base = () => {
  return (
    <div className={"h-screen bg-neutral-900 flex flex-col items-center"}>
      <h1
        className={
          "text-yellow-600 font-bold text-5xl tracking-widest bg-neutral-100/5 py-5 w-full text-center"
        }
      >
        VUE'D
      </h1>
      <div
        className={
          "isolate relative flex-1 flex flex-col justify-center w-full h-full"
        }
      >
        <Outlet />
      </div>
      <h1
        className={
          "text-yellow-600 text-xl bg-neutral-100/5 py-3 w-full text-center"
        }
      >
        Copyright: Bilaal Latif 2025
      </h1>
      {/*<TanStackRouterDevtools />*/}
    </div>
  );
};

export const BaseRoute = createRootRoute({
  component: Base,
});
