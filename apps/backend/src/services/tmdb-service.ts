import config from "../config/config";
import { injectable } from "inversify";

export type Movie = {
  id: number;
  title: string;
};

@injectable()
export class TmdbService {
  public async getMovie(title: string): Promise<Movie[]> {
    const url = new URL("https://api.themoviedb.org/3/search/movie");
    url.searchParams.set("query", title);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.tmdb_auth_token}`,
      },
    };

    const response = await fetch(url, options).then((res) => res.json());
    const movies: Movie[] = response.results.map(
      (movie_json: any) =>
        ({
          id: movie_json.id,
          title: movie_json.title,
        }) as Movie,
    );

    return movies;
  }
}
