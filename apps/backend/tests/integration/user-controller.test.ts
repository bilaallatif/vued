import { expect, test } from "vitest";
import app from "../../src/app";
import request = require("supertest");
import { UserCreationProps } from "../../src/controllers/user-controller";
import { User } from "@prisma/client";

test("POST /user creates a user and returns 201", async () => {
  const res = await request(app)
    .post("/user")
    .send({ username: "bilaal", password: "test" } as UserCreationProps);
  expect(res.status).toBe(201);

  const parsed_body = <User>res.body;
  expect(parsed_body.username).toBe("bilaal");
  expect(parsed_body).toHaveProperty("password");
  expect(parsed_body).toHaveProperty("id");
});
