import { prisma } from "./prismaClient";

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
  const courses = await prisma.Course.findMany({
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

export const getTotalStudentsInYear = async (year) => {
  const students = await prisma.student.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });

  return students.length;
};

export const getCompletionPercentagePerStudent = async () => {
  const students = await prisma.student.findMany({
    include: {
      completedCourses: true,
      inProgressCourses: true,
    },
  });

  return students.map((student) => {
    const totalCourses =
      student.completedCourses.length + student.inProgressCourses.length;
    const completedPercentage =
      (student.completedCourses.length / totalCourses) * 100;
    return {
      studentId: student.id,
      completedPercentage,
    };
  });
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

export const getPendingEnrollmentPerCourse = async () => {
  const courses = await prisma.course.findMany({
    include: {
      Class: {
        include: {
          pendingStudents: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    courseCode: course.code,
    pendingEnrollmentCount: course.Class.reduce(
      (count, _class) => count + _class.pendingStudents.length,
      0
    ),
  }));
};
