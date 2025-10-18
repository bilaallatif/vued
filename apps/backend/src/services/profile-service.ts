import { inject, injectable } from "inversify/lib/esm";
import { Prisma, PrismaClient, Profile } from "@prisma/client";

@injectable()
export class ProfileService {
  constructor(
    @inject("DB_CLIENT")
    private db_client: PrismaClient | Prisma.TransactionClient,
  ) {}

  public async getByUserId(id: string): Promise<Profile | null> {
    const profile = await this.db_client.profile.findUnique({
      where: { user_id: id },
    });
    return profile;
  }
}
