import { expect, test } from "vitest";
import app from "../../src/app";
import request = require("supertest");
import { UserCreationProps } from "../../src/controllers/user-controller";
import { User, Prisma } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import { run } from "node:test";

test("POST /user creates a user and returns 201", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

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

  // Check user inserted into database
  const user = await db_client.user.findUnique({
    where: { username: "bilaal" },
    include: { profile: true },
  });
  expect(user.username).toBe("bilaal");
  expect(user.profile.bio).toBe("Edit your bio!");
});

test("POST /user with existing username returns 409", async () => {
  // Setup database client
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

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
});
