import { Body, Controller, Post, Route } from "tsoa";
import { User } from "@prisma/client";
import { LoginService } from "../services/login-service";
import { DatabaseError } from "../types/result";
import { HttpError } from "../types/exceptions";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

type LoginProps = Pick<User, "username" | "password">;

@Route("/login")
export class LoginController extends Controller {
  private readonly loginService: LoginService = new LoginService();

  @Post()
  public async login(@Body() requestBody: LoginProps): Promise<string> {
    const user_result = await this.loginService.get(requestBody.username);
    if (!user_result.ok) {
      switch (user_result.error) {
        case DatabaseError.NotFound:
          throw new HttpError(401, "Authentication failed");
        default:
          throw new HttpError(500, `Unhandled error type ${user_result.error}`);
      }
    } else {
      const user = user_result.value;
      const match = await bcrypt.compare(requestBody.password, user.password);
      if (!match) {
        throw new HttpError(401, "Authentication failed");
      }

      return jwt.sign({ userId: user.id }, "test", { expiresIn: "1h" });
    }
  }
}
