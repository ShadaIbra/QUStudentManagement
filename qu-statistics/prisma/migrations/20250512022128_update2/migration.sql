/*
  Warnings:

  - Added the required column `takenSeats` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `CompletedCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `InProgressCourse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "crn" TEXT NOT NULL PRIMARY KEY,
    "instructorId" TEXT,
    "takenSeats" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Class_code_fkey" FOREIGN KEY ("code") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("code", "crn", "instructorId", "status", "totalSeats", "validated") SELECT "code", "crn", "instructorId", "status", "totalSeats", "validated" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE TABLE "new_CompletedCourse" (
    "studentId" TEXT NOT NULL,
    "classCrn" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "classCrn"),
    CONSTRAINT "CompletedCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompletedCourse_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompletedCourse" ("classCrn", "studentId") SELECT "classCrn", "studentId" FROM "CompletedCourse";
DROP TABLE "CompletedCourse";
ALTER TABLE "new_CompletedCourse" RENAME TO "CompletedCourse";
CREATE TABLE "new_InProgressCourse" (
    "studentId" TEXT NOT NULL,
    "classCrn" TEXT NOT NULL,
    "grade" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "classCrn"),
    CONSTRAINT "InProgressCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InProgressCourse_classCrn_fkey" FOREIGN KEY ("classCrn") REFERENCES "Class" ("crn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InProgressCourse" ("classCrn", "studentId") SELECT "classCrn", "studentId" FROM "InProgressCourse";
DROP TABLE "InProgressCourse";
ALTER TABLE "new_InProgressCourse" RENAME TO "InProgressCourse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
