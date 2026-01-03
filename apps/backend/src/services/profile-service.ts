import { inject, injectable } from "inversify";
import { Prisma, PrismaClient } from "@prisma/client";

@injectable()
export class ProfileService {
  constructor(
    @inject("DB_CLIENT")
    private db_client: PrismaClient | Prisma.TransactionClient,
  ) {}

  public async getByUserId(id: string) {
    const profile = await this.db_client.profile.findUnique({
      where: { user_id: id },
      include: { user: true },
    });
    return profile;
  }

  public async getProfiles() {
    const profiles = await this.db_client.profile.findMany({
      include: { user: true },
    });
    return profiles;
  }
}
