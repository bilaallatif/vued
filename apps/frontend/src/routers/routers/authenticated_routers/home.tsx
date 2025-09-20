import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useState } from "react";
import { Modal } from "../../../components/modal.tsx";
import { BasicButton } from "../../../components/buttons.tsx";
import {
  FormInput,
  FormRating,
  FormTextArea,
} from "../../../components/forms.tsx";

const NewReviewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [movie, setMovie] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={"text-5xl text-yellow-600"}>New Review</div>
      <div className={"flex-1 flex flex-col items-center gap-10 py-20"}>
        <FormInput
          type={"search"}
          name={"Movie"}
          value={movie}
          setValue={setMovie}
        />
        <FormInput name={"Title"} value={title} setValue={setTitle} />
        <FormTextArea
          name={"Description"}
          value={description}
          setValue={setDescription}
        />
        <FormRating name={"Rating"} />
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
