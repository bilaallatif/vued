import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Request,
  Route,
} from "tsoa";
import { inject, injectable } from "inversify";
import { ProfileService } from "../services/profile-service";
import { Request as ExRequest } from "express";
import { HttpError } from "../types/exceptions";
import { authHandler } from "../middleware/authentication";

export type ProfileDetailsDto = {
  user: {
    username: string;
  };
  bio: string;
};

type UpdateProfileDto = {
  bio: string;
};

@injectable()
@Route("/profile")
@Middlewares(authHandler)
export class ProfileController extends Controller {
  constructor(
    @inject(ProfileService) private readonly profileService: ProfileService,
  ) {
    super();
  }

  @Get()
  public async getProfiles(): Promise<ProfileDetailsDto[]> {
    const orm_profiles = await this.profileService.getProfiles();
    return orm_profiles.map(
      (profile) =>
        ({
          user: {
            username: profile.user.username,
          },
          bio: profile.bio,
        }) as ProfileDetailsDto,
    );
  }

  @Get("/me")
  public async getMyProfile(
    @Request() req: ExRequest,
  ): Promise<ProfileDetailsDto> {
    const orm_profile = await this.profileService.getByUserId(
      req.res?.locals.userId,
    );
    if (orm_profile == null) throw new HttpError(404, "Profile not found");

    return {
      user: {
        username: orm_profile.user.username,
      },
      bio: orm_profile.bio,
    } as ProfileDetailsDto;
  }

  @Patch("/me")
  public async updateMyProfile(
    @Body() requestBody: UpdateProfileDto,
    @Request() req: ExRequest,
  ): Promise<ProfileDetailsDto> {
    const orm_profile = await this.profileService.updateProfileByUserId(
      req.res?.locals.userId,
      requestBody.bio,
    );
    if (orm_profile == null) throw new HttpError(404, "Profile not found");

    return {
      user: {
        username: orm_profile.user.username,
      },
      bio: orm_profile.bio,
    } as ProfileDetailsDto;
  }
}
