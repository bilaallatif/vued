import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useState } from "react";
import { Modal } from "../../../components/modal.tsx";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <button
        className={
          "text-neutral-900 text-2xl bg-yellow-600 p-2 rounded-md hover:bg-yellow-500 hover:scale-110 transition-transform duration-200"
        }
        onClick={() => setIsModalOpen(true)}
      >
        New Review
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "home",
  component: Home,
});
