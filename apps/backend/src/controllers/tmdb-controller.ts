import { Controller, Get, Middlewares, Query, Route } from "tsoa";
import { MovieSearchDetails, TmdbService } from "../services/tmdb-service";
import { inject, injectable } from "inversify";
import { authHandler } from "../middleware/authentication";

@injectable()
@Route("/tmdb")
@Middlewares(authHandler)
export class TmdbController extends Controller {
  constructor(@inject(TmdbService) private readonly tmdbService: TmdbService) {
    super();
  }

  @Get()
  public async getTmdbMoviesByName(
    @Query() title: string,
  ): Promise<MovieSearchDetails[]> {
    return await this.tmdbService.getMovies(title);
  }
}
