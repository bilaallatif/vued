import { Controller, Get, Middlewares, Path, Route } from "tsoa";
import { inject, injectable } from "inversify";
import { MovieService } from "../services/movie-service";
import { HttpError } from "../types/exceptions";
import { authHandler } from "../middleware/authentication";

export type MovieDto = {
  id: string;
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
};

@injectable()
@Route("/movie")
@Middlewares(authHandler)
export class MovieController extends Controller {
  constructor(
    @inject(MovieService) private readonly movie_service: MovieService,
  ) {
    super();
  }

  @Get("{id}")
  public async getMovie(@Path() id: string): Promise<MovieDto> {
    const movie = await this.movie_service.getMovie(id);
    if (movie == null) {
      throw new HttpError(404, "Movie not found");
    }

    return movie;
  }
}
