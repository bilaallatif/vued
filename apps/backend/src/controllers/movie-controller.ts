import { Controller, Get, Query, Route } from "tsoa";
import { Movie, TmdbService } from "../services/tmdb-service";
import { inject, injectable } from "inversify";

@injectable()
@Route("/movie")
export class MovieController extends Controller {
  constructor(@inject(TmdbService) private readonly tmdbService: TmdbService) {
    super();
  }

  @Get()
  public async getMovie(@Query() title: string): Promise<Movie[]> {
    return await this.tmdbService.getMovie(title);
  }
}
