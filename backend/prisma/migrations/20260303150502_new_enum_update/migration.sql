/*
  Warnings:

  - The values [FullTime,PartTime,Student] on the enum `available` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "available_new" AS ENUM ('fulltime', 'parttime', 'student');
ALTER TABLE "Profile" ALTER COLUMN "availability" TYPE "available_new" USING ("availability"::text::"available_new");
ALTER TYPE "available" RENAME TO "available_old";
ALTER TYPE "available_new" RENAME TO "available";
DROP TYPE "public"."available_old";
COMMIT;
