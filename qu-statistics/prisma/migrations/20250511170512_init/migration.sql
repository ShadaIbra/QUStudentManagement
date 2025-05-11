-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    CONSTRAINT "Instructor_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpertiseArea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "area" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "preferenceOpen" BOOLEAN NOT NULL DEFAULT true,
    "categoryName" TEXT NOT NULL,
    CONSTRAINT "Course_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("categoryName") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CoursePrerequisite" (
    "courseCode" TEXT NOT NULL,
    "prerequisiteCode" TEXT NOT NULL,

    PRIMARY KEY ("courseCode", "prerequisiteCode"),
    CONSTRAINT "CoursePrerequisite_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CoursePrerequisite_prerequisiteCode_fkey" FOREIGN KEY ("prerequisiteCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "categoryName" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "PendingCourse" (
    "studentId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "courseCode"),
    CONSTRAINT "PendingCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PendingCourse_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InProgressCourse" (
    "studentId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "courseCode"),
    CONSTRAINT "InProgressCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InProgressCourse_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompletedCourse" (
    "studentId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    PRIMARY KEY ("studentId", "courseCode"),
    CONSTRAINT "CompletedCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompletedCourse_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Class" (
    "crn" TEXT NOT NULL PRIMARY KEY,
    "instructorId" TEXT,
    "totalSeats" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT NOT NULL,
    CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Class_code_fkey" FOREIGN KEY ("code") REFERENCES "Course" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_InstructorExpertise" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InstructorExpertise_A_fkey" FOREIGN KEY ("A") REFERENCES "ExpertiseArea" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InstructorExpertise_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CoursePreference" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CoursePreference_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CoursePreference_B_fkey" FOREIGN KEY ("B") REFERENCES "Instructor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_InstructorExpertise_AB_unique" ON "_InstructorExpertise"("A", "B");

-- CreateIndex
CREATE INDEX "_InstructorExpertise_B_index" ON "_InstructorExpertise"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoursePreference_AB_unique" ON "_CoursePreference"("A", "B");

-- CreateIndex
CREATE INDEX "_CoursePreference_B_index" ON "_CoursePreference"("B");
