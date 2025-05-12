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
