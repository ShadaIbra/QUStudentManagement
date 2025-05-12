/*
  Warnings:

  - The primary key for the `CompletedCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseCode` on the `CompletedCourse` table. All the data in the column will be lost.
  - The primary key for the `InProgressCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseCode` on the `InProgressCourse` table. All the data in the column will be lost.
  - The primary key for the `PendingCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseCode` on the `PendingCourse` table. All the data in the column will be lost.
  - Added the required column `classCrn` to the `CompletedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classCrn` to the `InProgressCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classCrn` to the `PendingCourse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompletedCourse" (
    "studentId" TEXT NOT NULL,
    "classCrn" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "classCrn"),
    CONSTRAINT "CompletedCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompletedCourse_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompletedCourse" ("studentId") SELECT "studentId" FROM "CompletedCourse";
DROP TABLE "CompletedCourse";
ALTER TABLE "new_CompletedCourse" RENAME TO "CompletedCourse";
CREATE TABLE "new_InProgressCourse" (
    "studentId" TEXT NOT NULL,
    "classCrn" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "classCrn"),
    CONSTRAINT "InProgressCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InProgressCourse_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InProgressCourse" ("studentId") SELECT "studentId" FROM "InProgressCourse";
DROP TABLE "InProgressCourse";
ALTER TABLE "new_InProgressCourse" RENAME TO "InProgressCourse";
CREATE TABLE "new_PendingCourse" (
    "studentId" TEXT NOT NULL,
    "classCrn" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "classCrn"),
    CONSTRAINT "PendingCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PendingCourse_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PendingCourse" ("studentId") SELECT "studentId" FROM "PendingCourse";
DROP TABLE "PendingCourse";
ALTER TABLE "new_PendingCourse" RENAME TO "PendingCourse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
