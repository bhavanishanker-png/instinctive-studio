/*
  Warnings:

  - You are about to drop the `_CohortCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CohortCourses" DROP CONSTRAINT "_CohortCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_CohortCourses" DROP CONSTRAINT "_CohortCourses_B_fkey";

-- DropTable
DROP TABLE "_CohortCourses";

-- CreateTable
CREATE TABLE "CohortCourse" (
    "cohortId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CohortCourse_pkey" PRIMARY KEY ("cohortId","courseId")
);

-- AddForeignKey
ALTER TABLE "CohortCourse" ADD CONSTRAINT "CohortCourse_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CohortCourse" ADD CONSTRAINT "CohortCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
