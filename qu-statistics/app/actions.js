"use server";

import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCoursesPerStudent = async () => {
  const [pending, inProgress, completed] = await Promise.all([
    prisma.pendingCourse.findMany({
      select: { studentId: true, classCrn: true },
    }),
    prisma.inProgressCourse.findMany({
      select: { studentId: true, classCrn: true },
    }),
    prisma.completedCourse.findMany({
      select: { studentId: true, classCrn: true },
    }),
  ]);

  const allCourses = [...pending, ...inProgress, ...completed];

  const studentCoursesMap = allCourses.reduce((acc, curr) => {
    if (!acc[curr.studentId]) acc[curr.studentId] = new Set();
    acc[curr.studentId].add(curr.classCrn);
    return acc;
  }, {});

  const coursesPerStudent = Object.keys(studentCoursesMap).map((studentId) => ({
    studentId,
    coursesCount: studentCoursesMap[studentId].size,
  }));

  return coursesPerStudent;
};

export const getTotalStudentsPerCategory = async () => {
  const categories = await prisma.category.findMany({
    include: {
      courses: {
        include: {
          Class: {
            include: {
              inProgressStudents: true,
              completedStudents: true,
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    categoryName: category.categoryName,
    studentCount: category.courses.reduce(
      (sum, course) =>
        sum +
        course.Class.reduce(
          (classSum, _class) =>
            classSum +
            _class.inProgressStudents.length +
            _class.completedStudents.length,
          0
        ),
      0
    ),
  }));
};

export const getTotalStudentsPerCourse = async () => {
  const courses = await prisma.course.findMany({
    include: {
      Class: {
        include: {
          inProgressStudents: true,
          completedStudents: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    courseCode: course.code,
    studentCount: course.Class.reduce(
      (count, _class) =>
        count +
        _class.inProgressStudents.length +
        _class.completedStudents.length,
      0
    ),
  }));
};

export async function getTop3Courses() {
  const courses = await prisma.course.findMany({
    include: {
      Class: true,
    },
    orderBy: {
      Class: {
        _count: "desc",
      },
    },
    take: 3,
  });

  return courses.map((course) => ({
    name: course.name,
    classCount: course.Class.length,
  }));
}

export const getFailureRatePerCourse = async () => {
  const courses = await prisma.course.findMany({
    include: {
      Class: {
        include: {
          inProgressStudents: true,
          completedStudents: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    courseCode: course.code,
    failureRate: course.Class.reduce((rate, _class) => {
      const failedStudents = _class.completedStudents.filter(
        (student) => student.grade === "F"
      );
      const totalStudents =
        _class.inProgressStudents.length + _class.completedStudents.length;

      const failureRateForClass =
        totalStudents > 0 ? failedStudents.length / totalStudents : 0;
      return rate + failureRateForClass;
    }, 0),
  }));
};

export const getFailureRatePerCategory = async () => {
  const categories = await prisma.category.findMany({
    include: {
      courses: {
        include: {
          Class: {
            include: {
              inProgressStudents: true,
              completedStudents: true,
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    categoryName: category.categoryName,
    failureRate: category.courses.reduce((rate, course) => {
      const courseFailureRate = course.Class.reduce((courseRate, _class) => {
        const failedStudents = _class.completedStudents.filter(
          (student) => student.grade === "F"
        );
        const totalStudents =
          _class.inProgressStudents.length + _class.completedStudents.length;

        const failureRateForClass =
          totalStudents > 0 ? failedStudents.length / totalStudents : 0;
        return courseRate + failureRateForClass;
      }, 0);

      return rate + courseFailureRate / category.courses.length;
    }, 0),
  }));
};

export const getStudentsWithAtLeastOneFailure = async () => {
  const students = await prisma.student.findMany({
    where: {
      enrollments: {
        some: {
          grade: {
            lt: 50, // Assuming 50 is the passing grade
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return students.length;
};

export const getAverageGradePerCourse = async () => {
  const courses = await prisma.course.findMany({
    include: {
      Class: {
        include: {
          completedStudents: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    courseCode: course.code,
    averageGrade: course.Class.reduce((avg, _class) => {
      const totalGrades = _class.completedStudents.reduce(
        (sum, student) =>
          sum +
          (student.grade === "A"
            ? 4
            : student.grade === "B"
            ? 3
            : student.grade === "C"
            ? 2
            : 0),
        0
      );
      const totalStudents = _class.completedStudents.length;
      return avg + (totalGrades / totalStudents || 0);
    }, 0),
  }));
};

export const getTop3InstructorsByClasses = async () => {
  const instructors = await prisma.instructor.findMany({
    include: {
      classes: true,
    },
  });

  const instructorClassCounts = instructors.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    classCount: instructor.classes.length,
  }));

  instructorClassCounts.sort((a, b) => b.classCount - a.classCount);

  return instructorClassCounts.slice(0, 3);
};

export const getMostPopularCategory = async () => {
  const result = await prisma.category.findMany({
    select: {
      categoryName: true,
      courses: {
        select: {
          Class: {
            select: {
              _count: {
                select: {
                  inProgressStudents: true,
                  completedStudents: true,
                  pendingStudents: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const categoriesWithCounts = result.map((cat) => {
    let totalEnrollments = 0;
    cat.courses.forEach((course) => {
      course.Class.forEach((cls) => {
        totalEnrollments += cls._count.inProgressStudents;
        totalEnrollments += cls._count.completedStudents;
        totalEnrollments += cls._count.pendingStudents;
      });
    });

    return {
      categoryName: cat.categoryName,
      totalEnrollments,
    };
  });

  categoriesWithCounts.sort((a, b) => b.totalEnrollments - a.totalEnrollments);

  return categoriesWithCounts[0]; // Most popular
};

export const getAverageClassSizePerCourse = async () => {
  const courses = await prisma.course.findMany({
    select: {
      code: true,
      name: true,
      Class: {
        select: {
          totalSeats: true,
        },
      },
    },
  });

  const result = courses.map((course) => {
    const totalSeats = course.Class.reduce(
      (acc, cls) => acc + cls.totalSeats,
      0
    );
    const avgSize =
      course.Class.length > 0 ? totalSeats / course.Class.length : 0;
    return {
      name: course.name,
      avgSize: avgSize.toFixed(1),
    };
  });

  return result.sort((a, b) => b.avgSize - a.avgSize).slice(0, 5); // top 5 by avg size
};

export const getPassRatePerCourse = async () => {
  const courses = await prisma.course.findMany({
    include: {
      Class: {
        include: {
          completedStudents: true,
        },
      },
    },
  });

  return courses.map((course) => {
    let totalPassed = 0;
    let totalStudents = 0;

    course.Class.forEach((_class) => {
      _class.completedStudents.forEach((student) => {
        totalStudents++;
        if (student.grade !== "F") {
          totalPassed++;
        }
      });
    });

    const passRate = totalStudents > 0 ? (totalPassed / totalStudents) * 100 : 0;

    return {
      courseCode: course.code,
      passRate: passRate.toFixed(2),
    };
  });
};

export const getInstructorWithMostClasses = async () => {
  const instructors = await prisma.instructor.findMany({
    include: {
      classes: true,
    },
  });

  const instructorClassCounts = instructors.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    classCount: instructor.classes.length,
  }));

  // Sort instructors by class count in descending order and return the one with most classes
  const topInstructor = instructorClassCounts.sort((a, b) => b.classCount - a.classCount)[0];

  return topInstructor;
};
