import { inject, injectable } from "inversify";
import {
  Controller,
  Post,
  Route,
  SuccessResponse,
  Request,
  Body,
  Middlewares,
  Get,
} from "tsoa";
import { Request as ExRequest } from "express";
import { HttpError } from "../types/exceptions";
import { ReviewService } from "../services/review-service";
import { ProfileService } from "../services/profile-service";
import { MovieService } from "../services/movie-service";
import { authHandler } from "../middleware/authentication";

type ReviewCreateDto = {
  tmdb_id: number;
  title: string;
  description: string;
  rating: number;
};

export type ReviewDto = {
  id: string;
  title: string;
  description: string;
  rating: number;
  created: Date;
  movie_id: string;
  profile_id: string;
};

export type ReviewDetailsDto = {
  title: string;
  description: string;
  rating: number;
  created: Date;
  movie: {
    title: string;
    overview: string;
    poster_path: string;
  };
  profile: {
    user: {
      username: string;
    };
    bio: string;
  };
};

@injectable()
@Route("/review")
@Middlewares(authHandler)
export class ReviewController extends Controller {
  constructor(
    @inject(MovieService) private readonly movieService: MovieService,
    @inject(ProfileService) private readonly profileService: ProfileService,
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {
    super();
  }

  @SuccessResponse(201, "Created")
  @Post()
  public async createReview(
    @Body() requestBody: ReviewCreateDto,
    @Request() req: ExRequest,
  ): Promise<ReviewDto> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    const cached_movie = await this.movieService.getOrCacheMovie(
      requestBody.tmdb_id,
    );

    const review = await this.reviewService.createReview(
      requestBody.title,
      requestBody.description,
      requestBody.rating,
      cached_movie.id,
      profile.id,
    );

    return review as ReviewDto;
  }

  @Get()
  public async getReviews(): Promise<ReviewDetailsDto[]> {
    const orm_reviews = await this.reviewService.getReviews();
    return orm_reviews.map(
      (orm_review) =>
        ({
          title: orm_review.title,
          description: orm_review.description,
          rating: orm_review.rating,
          created: orm_review.created,
          movie: {
            title: orm_review.movie.title,
            overview: orm_review.movie.overview,
            poster_path: orm_review.movie.poster_path,
          },
          profile: {
            user: {
              username: orm_review.profile.user.username,
            },
            bio: orm_review.profile.bio,
          },
        }) as ReviewDetailsDto,
    );
  }
}
