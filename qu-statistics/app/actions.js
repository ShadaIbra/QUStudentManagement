// some will be actions instead of api

import { prisma } from "@/lib/prisma";

export async function getStudentCountPerYear() {
  return await prisma.student.groupBy({
    by: ['year'],
    _count: true,
  });
}

export async function getStudentCountPerCategory() {
  return await prisma.course.groupBy({
    by: ['category'],
    _count: {
      classes: true,
    },
  });
}

export async function getStudentCountPerCourse() {
  return await prisma.grade.groupBy({
    by: ['classId'],
    _count: true,
  });
}

export async function getTop3Courses() {
  return await prisma.course.findMany({
    take: 3,
    orderBy: {
      classes: {
        _count: 'desc',
      },
    },
    include: {
      _count: {
        select: { classes: true },
      },
    },
  });
}

export async function getTop3Instructors() {
  return await prisma.instructor.findMany({
    take: 3,
    orderBy: {
      classes: {
        _count: 'desc',
      },
    },
    include: {
      _count: {
        select: { classes: true },
      },
    },
  });
}

export async function getFailureRatePerCourse() {
  const results = await prisma.grade.groupBy({
    by: ['classId'],
    _count: {
      _all: true,
      value: true,
    },
    where: {
      value: {
        lt: 50,
      },
    },
  });
  return results;
}

export async function getAverageGradePerCourse() {
  return await prisma.grade.groupBy({
    by: ['classId'],
    _avg: {
      value: true,
    },
  });
}

export async function getStudentsWithFailures() {
  return await prisma.grade.findMany({
    where: {
      value: {
        lt: 50,
      },
    },
    distinct: ['studentId'],
  });
}

export async function getValidatedClassCounts() {
  const validated = await prisma.class.count({ where: { validated: true } });
  const unvalidated = await prisma.class.count({ where: { validated: false } });
  return { validated, unvalidated };
}

export async function getClassCountPerCourse() {
  return await prisma.class.groupBy({
    by: ['courseId'],
    _count: true,
  });
}
