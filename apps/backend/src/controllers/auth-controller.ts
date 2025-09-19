import { Body, Controller, Get, Middlewares, Post, Request, Route } from "tsoa";
import { User } from "@prisma/client";
import { AuthService } from "../services/auth-service";
import { DatabaseError } from "../types/result";
import { HttpError } from "../types/exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request as ExRequest } from "express";
import { authHandler } from "../middleware/authentication";
import { UserService } from "../services/user-service";

type LoginProps = Pick<User, "username" | "password">;

@Route("/auth")
export class AuthController extends Controller {
  private readonly loginService: AuthService = new AuthService();
  private readonly userService: UserService = new UserService();

  @Get("test")
  @Middlewares(authHandler)
  public async test(@Request() req: ExRequest): Promise<string> {
    const user_id: string = req.res?.locals.userId;

    const user_result = await this.userService.get(user_id);
    if (!user_result.ok) {
      switch (user_result.error) {
        case DatabaseError.NotFound:
          throw new HttpError(404, "User not found");
        default:
          throw new HttpError(500, `Unhandled error type ${user_result.error}`);
      }
    }

    return user_result.value.username;
  }

  @Get("refresh")
  public async refresh(@Request() req: ExRequest): Promise<string> {
    // Get refresh token from cookies
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new HttpError(401, "Authentication failed");
    }

    // Get user from refresh token
    const payload = jwt.verify(refresh_token, "test") as JwtPayload;

    // Generate new access token
    return jwt.sign({ userId: payload.userId }, "test", {
      expiresIn: "15s",
    });
  }

  @Post("login")
  public async login(@Body() requestBody: LoginProps): Promise<string> {
    // Get user from username
    const user_result = await this.loginService.get(requestBody.username);
    if (!user_result.ok) {
      switch (user_result.error) {
        case DatabaseError.NotFound:
          throw new HttpError(401, "Authentication failed");
        default:
          throw new HttpError(500, `Unhandled error type ${user_result.error}`);
      }
    } else {
      // Compare password
      const user = user_result.value;
      const match = await bcrypt.compare(requestBody.password, user.password);
      if (!match) {
        throw new HttpError(401, "Authentication failed");
      }

      // Generate refresh token
      const refresh_token = jwt.sign({ userId: user.id }, "test", {
        expiresIn: "1d",
      });

      // Generate access token
      const access_token = jwt.sign({ userId: user.id }, "test", {
        expiresIn: "15s",
      });

      // todo: Fuck with the path and CORS
      // Return refresh token as HttpOnly cookie
      this.setHeader(
        "Set-Cookie",
        `refresh_token=${refresh_token}; Max-Age=6000; Path=/; HttpOnly; SameSite=None; Secure;`,
      );

      // Return the access token
      return access_token;
    }
  }

  @Get("logout")
  public async logout(): Promise<void> {
    // Remove refresh toke HttpOnly cookie
    this.setHeader(
      "Set-Cookie",
      "refresh_token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure;",
    );
  }
}
