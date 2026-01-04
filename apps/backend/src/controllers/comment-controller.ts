import {
  Controller,
  Delete,
  Middlewares,
  Path,
  Request,
  Route,
  SuccessResponse,
} from "tsoa";
import { authHandler } from "../middleware/authentication";
import { inject, injectable } from "inversify";
import { ReviewService } from "../services/review-service";
import { HttpError } from "../types/exceptions";
import { ProfileService } from "../services/profile-service";
import { Request as ExRequest } from "express";
import { DatabaseError } from "../types/result";

@injectable()
@Route("/comment")
@Middlewares(authHandler)
export class CommentController extends Controller {
  constructor(
    @inject(ProfileService) private readonly profileService: ProfileService,
    @inject(ReviewService) private readonly reviewService: ReviewService,
  ) {
    super();
  }

  @SuccessResponse(204, "No Content")
  @Delete("/{comment_id}")
  public async uncommentReview(
    @Path() comment_id: string,
    @Request() req: ExRequest,
  ): Promise<void> {
    const profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (profile == null) throw new HttpError(404, "Profile not found");

    const comment_result = await this.reviewService.deleteComment(
      comment_id,
      profile.id,
    );
    if (!comment_result.ok)
      switch (comment_result.error) {
        case DatabaseError.NOT_FOUND:
          throw new HttpError(404, "Comment not found for this user");
        default:
          throw new HttpError(500, "Failed to delete comment");
      }
  }
}
