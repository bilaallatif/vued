import { Body, Controller, Get, Post, Route, SuccessResponse } from "tsoa";
import { UserService } from "../services/user-service";
import { User } from "@prisma/client";

@Route("/user")
export class UserController extends Controller {
  @Get("")
  public async getUser(): Promise<User> {
    return new UserService().get();
  }

  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(@Body() _requestBody: User): Promise<User> {
    this.setStatus(201);
    return new UserService().create();
  }
}
