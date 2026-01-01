import config from "../config/config";
import { injectable } from "inversify";

export type MovieDetails = {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string;
};

export type MovieSearchDetails = Pick<MovieDetails, "tmdb_id" | "title">;

@injectable()
export class TmdbService {
  public async getMovieDetails(id: number): Promise<MovieDetails> {
    const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.tmdb_auth_token}`,
      },
    };

    const response = await fetch(url, options);
    if (response.status == 200) {
      const details = await response.json();
      const movie: MovieDetails = {
        tmdb_id: details.id,
        title: details.title,
        overview: details.overview,
        poster_path: details.poster_path,
      };
      return movie;
    }
    throw new Error("Failed to fetch movie details");
  }

  public async getMovies(title: string): Promise<MovieSearchDetails[]> {
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
    const movies: MovieSearchDetails[] = response.results
      .map(
        (movie_json: any) =>
          ({
            tmdb_id: movie_json.id,
            title: movie_json.title,
          }) as MovieSearchDetails,
      )
      // Only return the first 5 results
      .slice(0, 5);

    return movies;
  }
}
