import { test, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import { sign } from "jsonwebtoken";
import request = require("supertest");
import app from "../../src/app";
import { MovieDto } from "../../src/controllers/movie-controller";
import { randomUUID } from "node:crypto";

test("GET /movie for an existing movie should return the movie", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  // Mock user + profile
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

  // Mock movie
  const mock_movie = await db_client.movie.create({
    data: {
      tmdb_id: 1,
      title: "Test Movie",
      overview: "Test Overview",
      poster_path: "test.jpg",
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get(`/movie/${mock_movie.id}`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  const parsed_body = res.body as MovieDto;

  expect(parsed_body).toEqual({
    id: mock_movie.id,
    tmdb_id: mock_movie.tmdb_id,
    title: mock_movie.title,
    overview: mock_movie.overview,
    poster_path: mock_movie.poster_path,
  });
});

test("GET /movie for a non-existing movie should return 404", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  // Mock user + profile
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
    .get(`/movie/${randomUUID().toString()}`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(404);
});
