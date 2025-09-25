import { Prisma, PrismaClient, User } from "@prisma/client";
import { DatabaseError, ERR, OK, Result } from "../types/result";
import { injectable } from "inversify";

@injectable()
export class AuthService {
  constructor(private db_client: PrismaClient) {}

  public async get(username: string): Promise<Result<User, DatabaseError>> {
    const user_where: Prisma.UserWhereUniqueInput = { username: username };
    const user = await this.db_client.user.findUnique({
      where: user_where,
    });
    return user ? OK(user) : ERR(DatabaseError.NotFound);
  }
}
