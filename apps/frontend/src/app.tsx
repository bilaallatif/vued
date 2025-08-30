import { useAuth } from "./auth.tsx";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.tsx";

export const App = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};
