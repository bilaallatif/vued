import { Controller, Get, Query, Route } from "tsoa";
import { Movie, TmdbService } from "../services/tmdb-service";

@Route("/movie")
export class MovieController extends Controller {
  private readonly tmdbService: TmdbService = new TmdbService();

  @Get()
  public async getMovie(@Query() title: string): Promise<Movie[]> {
    return await this.tmdbService.getMovie(title);
  }
}
