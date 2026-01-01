import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useState } from "react";
import { Modal } from "../../../components/modal.tsx";
import { BasicButton } from "../../../components/buttons.tsx";
import {
  FormInput,
  FormRating,
  FormSearch,
  FormTextArea,
} from "../../../components/forms.tsx";
import { Default } from "@vued/sdk/api";

const NewReviewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [movie, setMovie] = useState("");
  const [_movieId, setMovieId] = useState<number | null>(null);
  const [movieData, setMovieData] = useState<{ title: string; id: number }[]>(
    [],
  );

  const onSearch = async (movie: string) => {
    setMovie(movie);
    const test = await Default.getTmdbMoviesByName({ query: { title: movie } });
    if (!test.error) {
      if (test.data) {
        const apiMovieData = test.data;
        setMovieData(apiMovieData);
      }
    }
  };

  const onSelect = (selected: { title: string; id: number }) => {
    setMovie(selected.title);
    setMovieId(selected.id);
    setMovieData([]);
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={"text-5xl text-yellow-600"}>New Review</div>
      <div className={"flex-1 flex flex-col items-center gap-10 py-20"}>
        <FormSearch
          name={"Movie"}
          searchStr={movie}
          onSearch={onSearch}
          onSelect={onSelect}
          data={movieData}
        ></FormSearch>
        <FormInput name={"Title"} value={title} setValue={setTitle} />
        <FormTextArea
          name={"Description"}
          value={description}
          setValue={setDescription}
        />
        <FormRating name={"Rating"} />
      </div>
      <BasicButton text={"Submit"} onClick={onSubmit} />
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
