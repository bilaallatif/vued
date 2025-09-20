import { createRoute, redirect } from "@tanstack/react-router";
import { BaseRoute } from "../../base.tsx";
import { Default } from "@vued/sdk/api";
import { useState } from "react";
import { LoginLayoutRoute } from "../login_base.tsx";
import { BasicButton } from "../../../components/buttons.tsx";
import { FormInput } from "../../../components/forms.tsx";

const Login = () => {
  const context = BaseRoute.useRouteContext();
  const navigate = BaseRoute.useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={"flex w-full h-full flex-col lg:flex-row justify-center"}>
      <div className={"flex-3 flex flex-col justify-center items-center"}>
        <div className={"flex flex-col px-10 w-full lg:px-0 lg:w-1/4 gap-10"}>
          <div className={"flex flex-col w-full gap-2"}>
            <FormInput
              name={"Username"}
              value={username}
              setValue={setUsername}
            />
            <FormInput
              type={"password"}
              name={"Password"}
              value={password}
              setValue={setPassword}
            />
          </div>

          <div className={"flex flex-row justify-start w-full gap-5"}>
            <BasicButton
              onClick={async () => {
                await context.auth.login(username, password);
                await navigate({ to: "/home" });
              }}
              text={"Login"}
            />
            <BasicButton
              onClick={async () => {
                const response = await Default.createUser({
                  body: { username, password },
                });
                if (!response.error) {
                  await context.auth.login(username, password);
                  await navigate({ to: "/home" });
                }
              }}
              text={"Sign Up"}
            />
          </div>
        </div>
      </div>
      <div
        className={
          "flex-2 text-neutral-400 bg-yellow-600/10 flex flex-col justify-center items-center"
        }
      >
        <p>Welcome to VUE'D!</p>
        <p>Screenplay by Bilaal Latif</p>
      </div>
    </div>
  );
};

export const LoginRoute = createRoute({
  getParentRoute: () => LoginLayoutRoute,
  path: "login",
  component: Login,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/home" });
    }
  },
});
