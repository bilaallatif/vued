import { createRoute } from "@tanstack/react-router";
import { Default } from "@vued/sdk/api";
import { useState } from "react";
import { NavbarRoute } from "../navbar.tsx";

const Home = () => {
  const [authText, setAuthText] = useState<string>("Pre Test");

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <h1 className={"text-5xl text-neutral-400"}>{authText}</h1>
      <button
        className={"text-5xl text-neutral-400 hover:text-yellow-600"}
        onClick={() =>
          Default.test()
            .then((res) => {
              if (res.error) {
                setAuthText("Not Authenticated!");
              } else {
                setAuthText(`Hi ${res.data!}!`);
              }
            })
            .catch((_err) => setAuthText("Failed!"))
        }
      >
        TEST
      </button>
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => NavbarRoute,
  path: "home",
  component: Home,
});
