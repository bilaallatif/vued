import {
  Controller,
  Delete,
  Request,
  Middlewares,
  Path,
  Route,
  SuccessResponse,
} from "tsoa";
import { authHandler } from "../middleware/authentication";
import { inject, injectable } from "inversify";
import { ReviewService } from "../services/review-service";
import { HttpError } from "../types/exceptions";
import { ProfileService } from "../services/profile-service";
import { Request as ExRequest } from "express";

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

    await this.reviewService.deleteComment(comment_id, profile.id);
  }
}
