import prisma from './prisma.js';

export async function getOpenPreferenceCourses() {
  return prisma.course.findMany({
    where: {
      preferenceOpen: true,
    },
    include: {
      category: true,
      preferenceList: true,
    },
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({

    include: {
      Class: true,
    }
  });
}

export async function createCourse(data) {
  const {
    code,
    name,
    categoryName,
    preferenceOpen,
    coursePrerequisites = [],
  } = data;


  const newCourse = await prisma.course.create({
    data: {
      code,
      name,
      categoryName,
      preferenceOpen,
    },
  });

  for (const prerequisiteCode of coursePrerequisites) {
    await prisma.coursePrerequisite.create({
      data: {
        courseCode: code,
        prerequisiteCode, 
      },
    });
  }

  return newCourse;
}


