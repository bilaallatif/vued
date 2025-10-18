/*
  Warnings:

  - Changed the type of `tmdb_id` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Movie" DROP COLUMN "tmdb_id",
ADD COLUMN     "tmdb_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdb_id_key" ON "public"."Movie"("tmdb_id");
