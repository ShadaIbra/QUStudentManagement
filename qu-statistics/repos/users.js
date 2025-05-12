import prisma from './prisma.js';

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      instructor: true,
      student: true,
      admin: true,
    },
  });
}
