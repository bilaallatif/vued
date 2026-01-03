import { expect, test } from "vitest";
import { Prisma } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import app from "../../src/app";
import request = require("supertest");
import { sign } from "jsonwebtoken";

test("GET /profile returns list of profiles", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  // Mock users with associated profiles
  const mock_user = await db_client.user.create({
    data: {
      username: "bilaal",
      password: "test",
      profile: {
        create: {
          bio: "Edit your bio!",
        },
      },
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get("/profile")
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  expect(res.body).toEqual([
    {
      user: {
        username: mock_user.username,
      },
      bio: "Edit your bio!",
    },
  ]);
});

test("GET /profile/me returns the requester users profile", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  // Mock users with associated profiles
  const mock_user = await db_client.user.create({
    data: {
      username: "bilaal",
      password: "test",
      profile: {
        create: {
          bio: "Edit your bio!",
        },
      },
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get("/profile/me")
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  expect(res.body).toEqual({
    user: {
      username: mock_user.username,
    },
    bio: "Edit your bio!",
  });
});
