import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTotalStudentsPerYear = async () => {
  const students = await prisma.student.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
  });

  return students.map((student) => ({
    year: new Date(student.createdAt).getFullYear(),
    studentCount: student._count.id,
  }));
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

export const getTop3Courses = async () => {
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

  const coursePopularity = courses.map((course) => ({
    courseCode: course.code,
    studentCount: course.Class.reduce(
      (count, _class) =>
        count +
        _class.inProgressStudents.length +
        _class.completedStudents.length,
      0
    ),
  }));

  return coursePopularity
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 3);
};

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
      return rate + failedStudents.length / totalStudents;
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
        return courseRate + failedStudents.length / totalStudents;
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
    select: {
      id: true,
      name: true,
      _count: {
        select: { classes: true },
      },
    },
    orderBy: {
      classes: {
        _count: "desc",
      },
    },
    take: 3,
  });

  return instructors;
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
