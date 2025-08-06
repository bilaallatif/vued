import { User } from "@prisma/client";
import db_client from "../database/prisma";
import { UserCreationProps } from "../controllers/user-controller";
import { DatabaseError, ERR, OK, Result } from "../types/result";
import bcrypt from "bcryptjs";

export class UserService {
  public async get(id: string): Promise<Result<User, DatabaseError>> {
    const user = await db_client.user.findUnique({ where: { id: id } });
    return user ? OK(user) : ERR(DatabaseError.NotFound);
  }

  public async create({
    username,
    password,
  }: UserCreationProps): Promise<User> {
    return await db_client.user.create({
      data: {
        username: username,
        password: await bcrypt.hash(password, 10),
      },
    });
  }
}
