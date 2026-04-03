/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `displayname` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "displayname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username";
