import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
} from "tsoa";
import { UserService } from "../services/user-service";
import { User } from "@prisma/client";
import { DatabaseError } from "../types/result";
import { HttpError } from "../types/exceptions";

export type UserCreationProps = Pick<User, "username" | "password">;

@Route("/user")
export class UserController extends Controller {
  private readonly userService: UserService = new UserService();

  @Get("{id}")
  public async getUser(@Path() id: string): Promise<User> {
    const user_result = await this.userService.get(id);
    if (!user_result.ok) {
      switch (user_result.error) {
        case DatabaseError.NotFound:
          throw new HttpError(404, "User not found");
        default:
          throw new HttpError(500, `Unhandled error type ${user_result.error}`);
      }
    } else {
      return user_result.value;
    }
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationProps,
  ): Promise<User> {
    this.setStatus(201);
    return new UserService().create(requestBody);
  }
}
