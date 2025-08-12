import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "./base.tsx";
import { Default } from "@vued/sdk/api";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: async () =>
      await Default.login({
        body: { username: "bilaal", password: "test" },
      }),
  });

  if (isPending) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error.message}</h1>;

  return <h1>{data?.data}</h1>;
};

export const LoginRoute = createRoute({
  getParentRoute: () => BaseRoute,
  path: "login",
  component: Login,
});
