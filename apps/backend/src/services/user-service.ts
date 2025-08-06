import { User } from "@prisma/client";
import db_client from "../database/prisma";

export class UserService {
  public async get(): Promise<User> {
    return (
      (await db_client.user.findFirst()) ??
      (() => {
        throw new Error("User not found");
      })()
    );
  }

  public async create(): Promise<User> {
    return await db_client.user.create({
      data: {
        username: "bilaal",
        password: "test",
      },
    });
  }
}
