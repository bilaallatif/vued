import { BaseLayout } from "../../components/base_layout.tsx";
import { createRoute } from "@tanstack/react-router";
import { BaseRoute } from "../base.tsx";

const LoginLayout = () => {
  return (
    <BaseLayout>
      <h1
        className={
          "text-yellow-600 font-bold text-5xl tracking-widest bg-neutral-100/5 py-5 w-full text-center"
        }
      >
        VUE'D
      </h1>
    </BaseLayout>
  );
};

export const LoginLayoutRoute = createRoute({
  getParentRoute: () => BaseRoute,
  id: "_login_base",
  component: LoginLayout,
});
