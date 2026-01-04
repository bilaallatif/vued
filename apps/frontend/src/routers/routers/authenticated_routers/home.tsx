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
import {
  Default,
  type ReviewDetailsDto,
  type ReviewDetailsWithInteractionsDto,
} from "@vued/sdk/api";
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

const ReviewInspectionModal = ({
  isOpen,
  onClose,
  review_id,
}: {
  isOpen: boolean;
  onClose: () => void;
  review_id: string;
}) => {
  const [reviewDetails, setReviewDetails] =
    useState<ReviewDetailsWithInteractionsDto | null>(null);
  const [liked, setLiked] = useState<boolean | null>(false);
  const [reloadKey, setReloadKey] = useState(0);

  const populateReviewDetails = async () => {
    const reviews_data = await Default.getReview({
      path: { review_id: review_id },
    });
    if (!reviews_data.error && reviews_data.data) {
      setReviewDetails(reviews_data.data);
    }
  };

  const populateLiked = async () => {
    const liked_data = await Default.getLikeStatus({
      path: { review_id: review_id },
    });
    if (!liked_data.error && liked_data.data) {
      setLiked(liked_data.data.liked);
    }
  };

  useEffect(() => {
    populateReviewDetails();
    populateLiked();
  }, [reloadKey]);

  const likeStatusChange = async () => {
    if (liked) {
      await Default.unlikeReview({ path: { review_id: review_id } });
    } else {
      await Default.likeReview({ path: { review_id: review_id } });
    }
    // trigger data reload
    setReloadKey((k) => k + 1);
  };

  if (!reviewDetails || liked == null) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={"text-5xl text-yellow-600"}>
        {reviewDetails.title} ({reviewDetails.rating})
      </div>
      <div className={"w-full flex-1 flex flex-col items-start gap-10 py-20"}>
        <div className={"text-2xl text-neutral-400"}>
          {reviewDetails.movie.title}
        </div>
        <div className={"text-xl text-neutral-400"}>
          {reviewDetails.description}
        </div>
        <div className={"text-xl text-neutral-400"}>
          - {reviewDetails.profile.user.username}
        </div>
        <div className={"flex flex-row gap-10 items-center"}>
          <div className={"text-xl text-neutral-400"}>
            {reviewDetails.likes} likes
          </div>
          <BasicButton
            onClick={async () => await likeStatusChange()}
            text={liked ? "Unlike" : "Like"}
          />
        </div>
      </div>
    </Modal>
  );
};

const ReviewCard = ({ details }: { details: ReviewDetailsDto }) => {
  const [isReviewInspectionOpen, setIsReviewInspectionOpen] = useState(false);
  return (
    <div>
      <ReviewInspectionModal
        isOpen={isReviewInspectionOpen}
        onClose={() => setIsReviewInspectionOpen(false)}
        review_id={details.id}
      />
      <Card onClick={() => setIsReviewInspectionOpen(true)}>
        <div className={"w-full flex flex-col items-start"}>
          <div className={"w-full flex flex-row justify-between"}>
            <div className={"text-2xl"}>
              {details.title} - {details.profile.user.username}
            </div>
            <div className={"text-2xl"}>{details.rating}</div>
          </div>
          <div className={"text-xl"}>{details.movie.title}</div>
        </div>
      </Card>
    </div>
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
        <ReviewCard details={review} />
      ))}
    </List>
  );
};

const Home = () => {
  const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);

  return (
    <div className={"w-full h-full flex flex-col items-center justify-between"}>
      <NewReviewModal
        isOpen={isNewReviewOpen}
        onClose={() => setIsNewReviewOpen(false)}
      />
      <ReviewsList />
      <div className={"p-10"}>
        <BasicButton
          onClick={() => setIsNewReviewOpen(true)}
          text={"New Review"}
        />
      </div>
    </div>
  );
};

export const HomeRoute = createRoute({
  getParentRoute: () => AuthenticatedLayoutRoute,
  path: "home",
  component: Home,
});
