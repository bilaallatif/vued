# Database Setup
- Set env variable `DATABASE_URL=postgres://test:test@localhost:5432/test`
- Migrate schema: `npx prisma migrate dev --name init`
- Generate PrismaClient - `npx prisma generate`