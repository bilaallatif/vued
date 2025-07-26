import User from "../types/user";
import { Controller, Get, Route } from "tsoa";
import { UserService } from "../services/user-service";

@Route("/user")
export class UserController extends Controller {
  @Get("")
  public async getUser(): Promise<User> {
    return new UserService().get();
  }
}
