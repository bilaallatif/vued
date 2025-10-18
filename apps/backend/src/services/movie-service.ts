import { inject, injectable } from "inversify";
import { Prisma, PrismaClient, Movie } from "@prisma/client";
import { TmdbService } from "./tmdb-service";

@injectable()
export class MovieService {
  constructor(
    @inject("DB_CLIENT")
    private db_client: PrismaClient | Prisma.TransactionClient,
    @inject(TmdbService) private readonly tmdbService: TmdbService,
  ) {}

  public async getOrCacheMovie(tmdb_id: number): Promise<Movie> {
    // Attempt to retrieve from database cache
    const cached_movie = await this.db_client.movie.findUnique({
      where: { tmdb_id: tmdb_id },
    });

    // If not found, fetch from TMDB and cache
    if (cached_movie == null) {
      const movie_details = await this.tmdbService.getMovieDetails(tmdb_id);
      const new_cached_movie = await this.db_client.movie.create({
        data: {
          tmdb_id: movie_details.id,
          title: movie_details.title,
          overview: movie_details.overview,
          poster_path: movie_details.poster_path,
        },
      });

      return new_cached_movie;
    }

    // If found, return from cache
    return cached_movie;
  }
}
