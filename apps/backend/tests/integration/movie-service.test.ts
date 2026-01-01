import { expect, test, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { iocContainer } from "../../src/ioc";
import { MovieService } from "../../src/services/movie-service";
import { TmdbService } from "../../src/services/tmdb-service";

test("getOrCacheMovie returns cached movie if already cached", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

  const mock_movie = {
    tmdb_id: 1,
    title: "Test Movie",
    overview: "Test Overview",
    poster_path: "test.jpg",
  };

  // Insert mock cached movie
  await db_client.movie.create({
    data: mock_movie,
  });

  const movieService = iocContainer.get(MovieService);

  // Get cached movie
  const cached_movie = await movieService.getOrCacheMovie(mock_movie.tmdb_id);
  expect(cached_movie).toEqual(expect.objectContaining(mock_movie));
});

test("getOrCacheMovie inserts new movie if not cached", async () => {
  const db_client: Prisma.TransactionClient = iocContainer.get("DB_CLIENT");

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

  const movieService = iocContainer.get(MovieService);

  // Get non-cached movie
  const cached_movie = await movieService.getOrCacheMovie(
    mock_movie_details.tmdb_id,
  );

  // Expect mock movie details to be returned
  expect(cached_movie).toEqual(
    expect.objectContaining({
      tmdb_id: mock_movie_details.tmdb_id,
      title: mock_movie_details.title,
      overview: mock_movie_details.overview,
      poster_path: mock_movie_details.poster_path,
    }),
  );

  // Get movie from database
  const cached_movie_orm = await db_client.movie.findUnique({
    where: { tmdb_id: mock_movie_details.tmdb_id },
  });
  // Expect movie to be inserted into database
  expect(cached_movie_orm).toEqual(
    expect.objectContaining({
      tmdb_id: mock_movie_details.tmdb_id,
      title: mock_movie_details.title,
      overview: mock_movie_details.overview,
      poster_path: mock_movie_details.poster_path,
    }),
  );
});
