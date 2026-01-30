/*
  Warnings:

  - The primary key for the `_ExperienceToTechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ProjectToTechStack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ExperienceToTechStack` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_ProjectToTechStack` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "_ExperienceToTechStack" DROP CONSTRAINT "_ExperienceToTechStack_AB_pkey";

-- AlterTable
ALTER TABLE "_ProjectToTechStack" DROP CONSTRAINT "_ProjectToTechStack_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_ExperienceToTechStack_AB_unique" ON "_ExperienceToTechStack"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTechStack_AB_unique" ON "_ProjectToTechStack"("A", "B");
