import { Prisma, User } from "@prisma/client";
import db_client from "../database/prisma";
import { DatabaseError, ERR, OK, Result } from "../types/result";

export class AuthService {
  public async get(username: string): Promise<Result<User, DatabaseError>> {
    const user_where: Prisma.UserWhereUniqueInput = { username: username };
    const user = await db_client.user.findUnique({
      where: user_where,
    });
    return user ? OK(user) : ERR(DatabaseError.NotFound);
  }
}
