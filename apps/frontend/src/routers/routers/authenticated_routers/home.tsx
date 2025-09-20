import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useState } from "react";
import { Modal } from "../../../components/modal.tsx";
import { BasicButton } from "../../../components/button.tsx";

const NewReviewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={"text-5xl text-neutral-400"}>New Review</div>
      <div className={"flex-1 flex flex-col items-center gap-10 py-5"}>
        <div className={"text-5xl text-neutral-400"}>Title</div>
        <div className={"text-5xl text-neutral-400"}>Description</div>
        <div className={"text-5xl text-neutral-400"}>Rating</div>
      </div>
      <BasicButton text={"Submit"} />
    </Modal>
  );
};

const Home = () => {
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);

  return (
    <div className={"w-full h-full flex flex-col items-center justify-center"}>
      <BasicButton
        onClick={() => setIsNewReviewOpen(true)}
        text={"New Review"}
      />
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
