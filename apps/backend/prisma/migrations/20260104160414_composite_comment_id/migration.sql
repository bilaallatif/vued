/*
  Warnings:

  - A unique constraint covering the columns `[id,profile_id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comment_id" ON "public"."Comment"("id", "profile_id");
