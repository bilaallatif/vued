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
  Path,
  Delete,
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

export type CommentDto = {
  id: string;
  desc: string;
  created: Date;
  profile: {
    user: {
      username: string;
    };
  };
};

export type ReviewDetailsWithInteractionsDto = ReviewDetailsDto & {
  likes: number;
  comments: CommentDto[];
};

export type LikeStatusDto = {
  liked: boolean;
};

export type CreateCommentDto = {
  desc: string;
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

  @Get("/{review_id}")
  public async getReview(
    @Path() review_id: string,
  ): Promise<ReviewDetailsWithInteractionsDto> {
    const orm_review = await this.reviewService.getReview(review_id);
    if (orm_review == null) throw new HttpError(404, "Review not found");

    return {
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
      likes: orm_review.likes.length,
      comments: orm_review.comments.map(
        (comment) =>
          ({
            id: comment.id,
            desc: comment.desc,
            created: comment.created,
            profile: {
              user: {
                username: comment.profile.user.username,
              },
            },
          }) as CommentDto,
      ),
    } as ReviewDetailsWithInteractionsDto;
  }

  @Get("/{review_id}/like/me/status")
  public async getLikeStatus(
    @Path() review_id: string,
    @Request() req: ExRequest,
  ): Promise<LikeStatusDto> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    const orm_like = await this.reviewService.getLike(review_id, profile.id);

    return {
      liked: orm_like != null,
    };
  }

  @SuccessResponse(204, "No Content")
  @Post("/{review_id}/like")
  public async likeReview(
    @Path() review_id: string,
    @Request() req: ExRequest,
  ): Promise<void> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    await this.reviewService.createLike(review_id, profile.id);
  }

  @SuccessResponse(204, "No Content")
  @Delete("/{review_id}/like")
  public async unlikeReview(
    @Path() review_id: string,
    @Request() req: ExRequest,
  ): Promise<void> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    await this.reviewService.deleteLike(review_id, profile.id);
  }

  @SuccessResponse(204, "No Content")
  @Post("/{review_id}/comment")
  public async commentReview(
    @Path() review_id: string,
    @Body() requestBody: CreateCommentDto,
    @Request() req: ExRequest,
  ): Promise<void> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    await this.reviewService.createComment(
      requestBody.desc,
      review_id,
      profile.id,
    );
  }
}
