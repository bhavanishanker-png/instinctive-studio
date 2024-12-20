/*
  Warnings:

  - You are about to drop the column `cohortId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `cohortId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `dateJoined` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Cohort` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CohortId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DateJoined` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StudentName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_cohortId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_cohortId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "cohortId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "cohortId",
DROP COLUMN "dateJoined",
DROP COLUMN "image",
DROP COLUMN "lastLogin",
DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "CohortId" INTEGER NOT NULL,
ADD COLUMN     "DateJoined" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Image" TEXT,
ADD COLUMN     "LastLogin" TIMESTAMP(3),
ADD COLUMN     "Status" TEXT NOT NULL,
ADD COLUMN     "StudentName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CohortToCourse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CohortToCourse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CohortToCourse_B_index" ON "_CohortToCourse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Cohort_name_key" ON "Cohort"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_CohortId_fkey" FOREIGN KEY ("CohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CohortToCourse" ADD CONSTRAINT "_CohortToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CohortToCourse" ADD CONSTRAINT "_CohortToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
