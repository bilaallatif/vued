import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import { UserService } from "../services/user-service";
import { User } from "@prisma/client";
import { HttpError } from "../types/exceptions";

export type UserCreationProps = Pick<User, "username" | "password">;

@Route("/user")
export class UserController extends Controller {
  private readonly userService: UserService = new UserService();

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationProps,
  ): Promise<User> {
    const user_result = await this.userService.create(requestBody);
    if (!user_result.ok) {
      switch (user_result.error) {
        default:
          throw new HttpError(500, `Unhandled error type ${user_result.error}`);
      }
    }

    this.setStatus(201);
    return user_result.value;
  }
}
