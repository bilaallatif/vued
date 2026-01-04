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

  public async getReviews() {
    const reviews = await this.db_client.review.findMany({
      include: {
        movie: true,
        profile: { include: { user: true } },
      },
    });
    return reviews;
  }

  public async getReview(id: string) {
    const review = await this.db_client.review.findUnique({
      where: { id: id },
      include: {
        movie: true,
        profile: { include: { user: true } },
        // we only need like scalar info (will only display count)
        likes: true,
        // we need commentator info
        comments: { include: { profile: { include: { user: true } } } },
      },
    });
    return review;
  }

  public async createLike(review_id: string, profile_id: string) {
    const like = await this.db_client.like.create({
      data: {
        review_id: review_id,
        profile_id: profile_id,
      },
    });
    return like;
  }

  public async deleteLike(review_id: string, profile_id: string) {
    const like = await this.db_client.like.delete({
      where: {
        like_id: {
          review_id: review_id,
          profile_id: profile_id,
        },
      },
    });
    return like;
  }

  public async getLike(review_id: string, profile_id: string) {
    const like = await this.db_client.like.findUnique({
      where: {
        like_id: {
          review_id: review_id,
          profile_id: profile_id,
        },
      },
    });
    return like;
  }
}
