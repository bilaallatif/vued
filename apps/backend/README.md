# Database Setup
- Set env variable `DATABASE_URL=postgres://user:pass@localhost:5432/dev`
- Migrate schema: `npx prisma migrate dev --name init`
- Generate PrismaClient - `npx prisma generate`