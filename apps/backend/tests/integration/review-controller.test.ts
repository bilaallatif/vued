import { expect, test, vi } from "vitest";
import { iocContainer } from "../../src/ioc";
import { TmdbService } from "../../src/services/tmdb-service";
import request = require("supertest");
import app from "../../src/app";
import { Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";
import {
  ReviewDetailsDto,
  ReviewDto,
} from "../../src/controllers/review-controller";

test("POST /review for a non-cached movie creates a review and caches movie", async () => {
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
    tmdb_id: 1,
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
      tmdb_id: 1,
      title: "Test Title",
      description: "Test Description",
      rating: 5,
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
    tmdb_id: mock_movie_details.tmdb_id,
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

test("POST /review for a cached movie creates a review and does not cache movie", async () => {
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
      tmdb_id: mock_movie.tmdb_id,
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

test("GET /review returns list of reviews", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get("/review")
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  const parsed_body = res.body as ReviewDetailsDto[];

  expect(parsed_body).toEqual([
    {
      title: review.title,
      description: review.description,
      rating: review.rating,
      created: expect.any(String),
      movie: {
        title: mock_movie.title,
        overview: mock_movie.overview,
        poster_path: mock_movie.poster_path,
      },
      profile: {
        bio: mock_profile.bio,
        user: {
          username: mock_user.username,
        },
      },
    },
  ]);
});

test("GET /review/:review_id/like/me/status returns true for review liked by authenticated user", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  await db_client.like.create({
    data: {
      review_id: review.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get(`/review/${review.id}/like/me/status`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  expect(res.body).toEqual({
    liked: true,
  });
});

test("GET /review/:review_id/like/me/status returns false for review not liked by authenticated user", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get(`/review/${review.id}/like/me/status`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  expect(res.body).toEqual({
    liked: false,
  });
});

test("GET /review/:review_id returns review with user interaction", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  await db_client.like.create({
    data: {
      review_id: review.id,
      profile_id: mock_profile.id,
    },
  });

  const comment = await db_client.comment.create({
    data: {
      review_id: review.id,
      profile_id: mock_profile.id,
      desc: "Test Comment",
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .get(`/review/${review.id}`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(200);

  expect(res.body).toEqual({
    title: review.title,
    description: review.description,
    rating: review.rating,
    created: expect.any(String),
    movie: {
      title: mock_movie.title,
      overview: mock_movie.overview,
      poster_path: mock_movie.poster_path,
    },
    profile: {
      bio: mock_profile.bio,
      user: {
        username: mock_user.username,
      },
    },
    likes: 1,
    comments: [
      {
        desc: comment.desc,
        created: expect.any(String),
        profile: {
          user: {
            username: mock_user.username,
          },
        },
      },
    ],
  });
});

test("POST /review/:review_id/like creates a like for authenticated user", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .post(`/review/${review.id}/like`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(204);

  const like = await db_client.like.findUnique({
    where: {
      like_id: {
        review_id: review.id,
        profile_id: mock_profile.id,
      },
    },
  });

  expect(like).not.toBeNull();
});

test("DELETE /review/:review_id/like deletes a like for authenticated user", async () => {
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
  const mock_profile = await db_client.profile.findUnique({
    where: { user_id: mock_user.id },
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

  const review = await db_client.review.create({
    data: {
      title: "Test Title",
      description: "Test Description",
      rating: 5,
      movie_id: mock_movie.id,
      profile_id: mock_profile.id,
    },
  });

  await db_client.like.create({
    data: {
      review_id: review.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .delete(`/review/${review.id}/like`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(204);

  const like = await db_client.like.findUnique({
    where: {
      like_id: {
        review_id: review.id,
        profile_id: mock_profile.id,
      },
    },
  });

  expect(like).toBeNull();
});
