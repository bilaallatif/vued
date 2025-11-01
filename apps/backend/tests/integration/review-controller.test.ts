import { expect, test, vi } from "vitest";
import { iocContainer } from "../../src/ioc";
import { TmdbService } from "../../src/services/tmdb-service";
import request = require("supertest");
import app from "../../src/app";
import { Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { ReviewDto } from "../../src/controllers/review-controller";

test("POST /reviews for a non-cached movie creates a review and caches movie", async () => {
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

  // Mock TMDB API response
  const mock_movie_details = {
    id: 1,
    title: "Test Movie",
    overview: "Test Overview",
    poster_path: "test.jpg",
  };

  const tmdbService = iocContainer.get(TmdbService);
  // Mock the getMovieDetails method to return the mock movie details
  vi.spyOn(tmdbService, "getMovieDetails").mockResolvedValue(
    mock_movie_details,
  );

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .post("/review")
    .send({
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: 1,
    })
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(201);

  const parsed_body = res.body as ReviewDto;

  // Assert mock movie has been cached
  const movie_details = await db_client.movie.findUnique({
    where: { id: parsed_body.movie_id },
  });
  expect(movie_details).toEqual({
    id: parsed_body.movie_id,
    tmdb_id: mock_movie_details.id,
    title: mock_movie_details.title,
    overview: mock_movie_details.overview,
    poster_path: mock_movie_details.poster_path,
  });

  const profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
  });

  const review = await db_client.review.findUnique({
    where: { id: parsed_body.id },
  });
  expect(review).toEqual({
    id: parsed_body.id,
    title: "Test Title",
    description: "Test Description",
    rating: 5,
    movie_id: movie_details.id,
    profile_id: profile.id,
    created: expect.any(Date),
  });
});

test("POST /reviews for a cached movie creates a review and does not cache movie", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  // Spy on TmdbService to check if getMovieDetails is called
  const tmdbService = iocContainer.get(TmdbService);
  const get_movie_details_spy = vi.spyOn(tmdbService, "getMovieDetails");

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
    .post("/review")
    .send({
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.tmdb_id,
    })
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(201);

  expect(get_movie_details_spy).not.toHaveBeenCalled();

  const parsed_body = res.body as ReviewDto;

  const profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
  });

  const review = await db_client.review.findUnique({
    where: { id: parsed_body.id },
  });
  expect(review).toEqual({
    id: parsed_body.id,
    title: "Test Title",
    description: "Test Description",
    rating: 5,
    movie_id: mock_movie.id,
    profile_id: profile.id,
    created: expect.any(Date),
  });
});
