import { Controller, Get, Route } from "tsoa";
import { inject, injectable } from "inversify";
import { ProfileService } from "../services/profile-service";

export type ProfileDetailsDto = {
  user: {
    username: string;
  };
  bio: string;
};

@injectable()
@Route("/profile")
// @Middlewares(authHandler)
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
}
