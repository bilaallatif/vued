import { expect, test } from "vitest";
import { Prisma } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import { sign } from "jsonwebtoken";
import app from "../../src/app";
import request = require("supertest");

test("DELETE /comment/:comment_id removes a comment from an authenticated user", async () => {
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

  const comment = await db_client.comment.create({
    data: {
      desc: "Test Comment",
      review_id: review.id,
      profile_id: mock_profile.id,
    },
  });

  // Generate access token for user
  const access_token = sign({ userId: mock_user.id }, "test", {
    expiresIn: "60s",
  });

  const res = await request(app)
    .delete(`/comment/${comment.id}`)
    .set("Authorization", `Bearer ${access_token}`);

  expect(res.statusCode).toBe(204);

  const orm_comment = await db_client.comment.findUnique({
    where: { id: comment.id },
  });

  expect(orm_comment).toBeNull();
});
