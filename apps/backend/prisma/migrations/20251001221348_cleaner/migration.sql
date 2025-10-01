/*
  Warnings:

  - You are about to drop the `_ProfileToReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ProfileToReview" DROP CONSTRAINT "_ProfileToReview_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProfileToReview" DROP CONSTRAINT "_ProfileToReview_B_fkey";

-- DropTable
DROP TABLE "public"."_ProfileToReview";

-- CreateTable
CREATE TABLE "public"."Like" (
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("profile_id","review_id")
);

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
