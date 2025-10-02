import { PrismaClient, Prisma, User } from "@prisma/client";
import { DatabaseError, ERR, OK, Result } from "../types/result";
import bcrypt from "bcryptjs";
import { UserCreationProps } from "../controllers/user-controller";
import { inject, injectable } from "inversify";

@injectable()
export class UserService {
  constructor(
    @inject("DB_CLIENT")
    private db_client: PrismaClient | Prisma.TransactionClient,
  ) {}

  public async get(id: string): Promise<Result<User, DatabaseError>> {
    const user = await this.db_client.user.findUnique({ where: { id: id } });
    return user ? OK(user) : ERR(DatabaseError.NOT_FOUND);
  }

  public async create({
    username,
    password,
  }: UserCreationProps): Promise<Result<User, DatabaseError>> {
    const existing_user = await this.db_client.user.findUnique({
      where: { username: username },
    });
    if (existing_user) {
      return ERR(DatabaseError.COLLISION);
    }

    const user = await this.db_client.user.create({
      data: {
        username: username,
        password: await bcrypt.hash(password, 10),
        profile: {
          create: {
            bio: "Edit your bio!",
          },
        },
      },
    });

    return user ? OK(user) : ERR(DatabaseError.NOT_CREATED);
  }
}
