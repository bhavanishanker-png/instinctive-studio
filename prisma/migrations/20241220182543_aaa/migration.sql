/*
  Warnings:

  - You are about to drop the `_CohortToCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CohortToCourse" DROP CONSTRAINT "_CohortToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CohortToCourse" DROP CONSTRAINT "_CohortToCourse_B_fkey";

-- DropTable
DROP TABLE "_CohortToCourse";

-- CreateTable
CREATE TABLE "_CohortCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CohortCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CohortCourses_B_index" ON "_CohortCourses"("B");

-- AddForeignKey
ALTER TABLE "_CohortCourses" ADD CONSTRAINT "_CohortCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CohortCourses" ADD CONSTRAINT "_CohortCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
