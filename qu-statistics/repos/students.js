import prisma from './prisma.js';

// Get all students 
export async function getAllStudents() {
  return await prisma.student.findMany({
    include: {
      user: true, // to compare in login
    },
  });
}

export async function getStudentById(id) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      pendingCourses: {
        include: {
          Class: {
            include: {
              instructor: true,
              course: true,
            }
          },
        }
      },
      inProgressCourses: {
        include: {
          Class: {
            include: {
              instructor: true,
              course: true,
            }
          },
        }
      },
      completedCourses: {
        include: {
          Class: {
            include: {
              instructor: true,
              course: true,
            }
          },
        }
      },
    },
  });
}

// export async function getStudentCoursesByType(id, classType) {
//   const validTypes = {
//     pending: 'pendingCourses',
//     inprogress: 'inProgressCourses',
//     completed: 'completedCourses',
//   };

//   const field = validTypes[classType.toLowerCase()];
//   if (!field) throw new Error(`Invalid course type: ${classType}`);

//   const result = await prisma.student.findUnique({
//     where: { id },
//     select: { [field]: true },
//   });

//   return result?.[field] || [];
// }

// Add a pending course
export async function addPendingCourse(studentId, classCrn) {
  return prisma.pendingCourse.create({
    data: {
      studentId,
      classCrn,
    },
  });
}

// Remove a pending course
export async function removePendingCourse(studentId, classCrn) {
  return prisma.pendingCourse.delete({
    where: {
      studentId_classCrn: {
        studentId,
        classCrn,
      },
    },
  });
}



