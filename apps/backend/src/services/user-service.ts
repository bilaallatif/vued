import { PrismaClient, User } from "@prisma/client";
import { DatabaseError, ERR, OK, Result } from "../types/result";
import bcrypt from "bcryptjs";
import { UserCreationProps } from "../controllers/user-controller";
import { injectable } from "inversify";

@injectable()
export class UserService {
  constructor(private db_client: PrismaClient) {}

  public async get(id: string): Promise<Result<User, DatabaseError>> {
    const user = await this.db_client.user.findUnique({ where: { id: id } });
    return user ? OK(user) : ERR(DatabaseError.NotFound);
  }

  public async create({
    username,
    password,
  }: UserCreationProps): Promise<Result<User, DatabaseError>> {
    const user = await this.db_client.user.create({
      data: {
        username: username,
        password: await bcrypt.hash(password, 10),
      },
    });

    return user ? OK(user) : ERR(DatabaseError.NotCreated);
  }
}
