import React from "react";
import { Outlet } from "@tanstack/react-router";

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        "h-screen bg-neutral-900 flex flex-col items-center font-[Courier]"
      }
    >
      {children}
      <div className={"isolate relative flex-1 w-full h-full"}>
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
