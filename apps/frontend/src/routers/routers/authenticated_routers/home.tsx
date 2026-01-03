import { createRoute } from "@tanstack/react-router";
import { AuthenticatedLayoutRoute } from "../authenticated_base.tsx";
import { useEffect, useState } from "react";
import { Modal } from "../../../components/modal.tsx";
import { BasicButton } from "../../../components/buttons.tsx";
import {
  FormInput,
  FormRating,
  FormSearch,
  FormTextArea,
} from "../../../components/forms.tsx";
import { Default, type ReviewDetailsDto } from "@vued/sdk/api";
import { List } from "../../../components/list.tsx";
import { Card } from "../../../components/card.tsx";

const NewReviewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [movie, setMovie] = useState("");
  const [tmdbId, setTmdbId] = useState<number | null>(null);
  const [movieData, setMovieData] = useState<
    { title: string; tmdb_id: number }[]
  >([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  const onSearch = async (movie: string) => {
    setMovie(movie);
    const tmdb_movie_details = await Default.getTmdbMoviesByName({
      query: { title: movie },
    });
    if (!tmdb_movie_details.error) {
      if (tmdb_movie_details.data) {
        const apiMovieData = tmdb_movie_details.data;
        setMovieData(apiMovieData);
      }
    }
  };

  const onSelect = (selected: { title: string; tmdb_id: number }) => {
    setMovie(selected.title);
    setTmdbId(selected.tmdb_id);
    setMovieData([]);
  };

  const onSubmit = async () => {
    if (tmdbId === null) {
      console.error("No movie selected!");
      return;
    }

    await Default.createReview({
      body: {
        tmdb_id: tmdbId,
        title: title,
        description: description,
        rating: rating,
      },
    });

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
        <FormRating name={"Rating"} value={rating} setValue={setRating} />
      </div>
      <BasicButton text={"Submit"} onClick={onSubmit} />
    </Modal>
  );
};

const ReviewCard = ({
  title,
  rating,
  movie_name,
  description,
}: {
  title: string;
  rating: number;
  movie_name: string;
  description: string;
}) => {
  return (
    <Card>
      <div className={"flex flex-col"}>
        <div className={"flex flex-row justify-between"}>
          <div className={"text-2xl"}>{title}</div>
          <div className={"text-2xl"}>{rating}</div>
        </div>
        <div className={"text-xl"}>{movie_name}</div>
      </div>
      <div className={"flex-1"}>{description}</div>
    </Card>
  );
};

const ReviewsList = () => {
  const [reviews, setReviews] = useState<ReviewDetailsDto[]>([]);

  const populateReviews = async () => {
    const reviews_data = await Default.getReviews();
    if (!reviews_data.error && reviews_data.data) {
      setReviews(reviews_data.data);
    }
  };

  useEffect(() => {
    populateReviews();
  }, []);

  return (
    <List>
      {reviews.map((review) => (
        <ReviewCard
          title={review.title}
          rating={review.rating}
          movie_name={review.movie.title}
          description={review.description}
        />
      ))}
    </List>
  );
};

const Home = () => {
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);

  return (
    <div className={"w-full h-full flex flex-col items-center"}>
      <NewReviewModal
        isOpen={isNewReviewOpen}
        onClose={() => setIsNewReviewOpen(false)}
      />
      <div className={"p-4"}>
        <BasicButton
          onClick={() => setIsNewReviewOpen(true)}
          text={"New Review"}
        />
      </div>
      <ReviewsList />
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "home",
  component: Home,
});
