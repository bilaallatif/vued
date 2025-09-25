import { expect, test } from "vitest";
import app from "../../src/app";
import request = require("supertest");

test("GET /test returns 'Hello World!'", async () => {
  const res = await request(app).get("/test");
  expect(res.status).toBe(200);
  expect(res.body).toBe("Hello World!");
});
