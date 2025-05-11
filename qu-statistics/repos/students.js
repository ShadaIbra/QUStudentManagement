import prisma from './prisma.js';

// Get all students 
export async function getAllStudents() {
  return await prisma.student.findMany({
    include: {
      user: true, // to compare in login
    },
  });
}




