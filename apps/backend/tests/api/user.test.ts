import { expect, test } from "vitest";
import app from "../../src/app";
import request = require("supertest");
import { UserCreationProps } from "../../src/controllers/user-controller";
import { GenericContainer } from "testcontainers";

test("POST /user creates a user and returns 201", async () => {
  const res = await request(app)
    .post("/user")
    .send({ username: "bilaal", password: "test" } as UserCreationProps);
  expect(res.status).toBe(201);
  // expect(res.body).toBe({ username: "bilaal", password: "test" } as User);
});
