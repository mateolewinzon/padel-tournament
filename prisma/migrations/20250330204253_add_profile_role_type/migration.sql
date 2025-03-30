/*
  Warnings:

  - The `role` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'user';
