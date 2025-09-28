import { expect, test } from "vitest";
import app from "../../src/app";
import request = require("supertest");
import { UserCreationProps } from "../../src/controllers/user-controller";
import { PrismaClient, User } from "@prisma/client";
import config from "../../src/config/config";
import { iocContainer } from "../../src/ioc";
import { Rollback } from "../../src/types/exceptions";

test("POST /user creates a user and returns 201", async () => {
  const p_client: PrismaClient = new PrismaClient({
    datasourceUrl: config.db_url,
  });

  try {
    await p_client.$transaction(async (tx) => {
      await iocContainer.unbind("DB_CLIENT");

      iocContainer
        .bind("DB_CLIENT")
        .toDynamicValue(() => tx)
        .inTransientScope();

      // Create user
      const res = await request(app)
        .post("/user")
        .send({ username: "bilaal", password: "test" } as UserCreationProps);
      expect(res.status).toBe(201);

      // Assert user returned
      const parsed_body = <User>res.body;
      expect(parsed_body.username).toBe("bilaal");
      expect(parsed_body).toHaveProperty("password");
      expect(parsed_body).toHaveProperty("id");

      // Setup database client
      const db_client = new PrismaClient({ datasourceUrl: config.db_url });

      // Check user inserted into database
      const user = await tx.user.findUnique({
        where: { username: "bilaal" },
      });
      expect(user.username).toBe("bilaal");

      throw new Rollback();
    });
  } catch (e) {
    if (e instanceof Rollback) return;
    throw e;
  }
});

test("POST /user with existing username returns 409", async () => {
  const p_client: PrismaClient = new PrismaClient({
    datasourceUrl: config.db_url,
  });

  try {
    await p_client.$transaction(async (tx) => {
      await iocContainer.unbind("DB_CLIENT");

      iocContainer
        .bind("DB_CLIENT")
        .toDynamicValue(() => tx)
        .inTransientScope();

      // Setup database client
      const db_client = new PrismaClient({ datasourceUrl: config.db_url });
      // Insert mock user
      await db_client.user.create({
        data: {
          username: "bilaal",
          password: "test",
        },
      });

      // Create user with existing username
      const res = await request(app)
        .post("/user")
        .send({ username: "bilaal", password: "test" } as UserCreationProps);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Username already exists");

      throw new Rollback();
    });
  } catch (e) {
    if (e instanceof Rollback) return;
    throw e;
  }
});
