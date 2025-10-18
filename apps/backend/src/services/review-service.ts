import { inject, injectable } from "inversify";
import { Prisma, PrismaClient, Review } from "@prisma/client";

@injectable()
export class ReviewService {
  constructor(
    @inject("DB_CLIENT")
    private db_client: PrismaClient | Prisma.TransactionClient,
  ) {}

  public async createReview(
    title: string,
    description: string,
    rating: number,
    movie_id: string,
    profile_id: string,
  ): Promise<Review> {
    // Create a new review
    // Connect to an existing movie and profile
    const review = await this.db_client.review.create({
      data: {
        title: title,
        description: description,
        rating: rating,
        movie: { connect: { id: movie_id } },
        profile: { connect: { id: profile_id } },
      },
    });

    return review;
  }
}
