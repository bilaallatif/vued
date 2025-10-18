import { Controller, Get, Query, Route } from "tsoa";
import { MovieSearchDetails, TmdbService } from "../services/tmdb-service";
import { inject, injectable } from "inversify";

@injectable()
@Route("/movie")
export class MovieController extends Controller {
  constructor(@inject(TmdbService) private readonly tmdbService: TmdbService) {
    super();
  }

  // todo: rename to getMovies
  @Get()
  public async getMovie(@Query() title: string): Promise<MovieSearchDetails[]> {
    return await this.tmdbService.getMovies(title);
  }
}
