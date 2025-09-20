import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useState } from "react";
import { Modal } from "../../../components/modal.tsx";

const NewReviewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={"flex flex-col items-center gap-10"}>
        <div className={"text-5xl text-yellow-600"}>New Review</div>
        <div className={"text-5xl text-yellow-600"}>Title</div>
        <div className={"text-5xl text-yellow-600"}>Description</div>
        <div className={"text-5xl text-yellow-600"}>Rating</div>
        <div className={"text-5xl text-yellow-600"}>Submit</div>
      </div>
    </Modal>
  );
};

const Home = () => {
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <button
        className={
          "text-neutral-900 text-2xl bg-yellow-600 p-2 rounded-md hover:bg-yellow-500 hover:scale-110 transition-transform duration-200"
        }
        onClick={() => setIsNewReviewOpen(true)}
      >
        New Review
      </button>
      <NewReviewModal
        isOpen={isNewReviewOpen}
        onClose={() => setIsNewReviewOpen(false)}
      />
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "home",
  component: Home,
});
