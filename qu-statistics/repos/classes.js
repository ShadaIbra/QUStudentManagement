import prisma from './prisma.js';

export async function getClassesByStatus(status) {
    const upperStatus = status.toUpperCase();

    const validStatuses = ['PENDING', 'INPROGRESS', 'COMPLETED'];

    if (!validStatuses.includes(upperStatus)) {
        throw new Error(`Invalid status: ${status}`);
    }

    return await prisma.class.findMany({
        where: { status: upperStatus },
        include: {
            instructor: true,
            course: {
                include: {
                    coursePrerequisites: true,
                    preferenceList: true,
                }
            },
        },
    });
}

export async function updateClassByCrn(crn, updates) {
    return prisma.class.update({
        where: { crn },
        data: updates,
    });
}

export async function getInProgClassesByInstructor(instructorId) {
    return prisma.class.findMany({
        where: {
            status: 'INPROGRESS',
            instructorId: instructorId,
        },
        include: {
            course: true,
        },
    });
}

export async function getClassWithStudents(crn) {
    return prisma.class.findUnique({
        where: { crn },
        include: {
            course: true,
            inProgressStudents: {
                include: {
                    student: true,
                },
            },
        },
    });
}

export async function updateStudentGrade(crn, studentId, grade) {
    return prisma.inProgressCourse.update({
        where: {
            studentId_classCrn: {
                studentId,
                classCrn: crn,
            },
        },
        data: {
            grade,
        },
    });
}

export async function promotePendingToInProgress(classCrn) {
    const pending = await prisma.pendingCourse.findMany({
        where: { classCrn },
    });

    for (const entry of pending) {
        await prisma.inProgressCourse.create({
            data: {
                studentId: entry.studentId,
                classCrn: entry.classCrn,
                grade: '-', // default grade
            },
        });

        await prisma.pendingCourse.delete({
            where: {
                studentId_classCrn: {
                    studentId: entry.studentId,
                    classCrn: entry.classCrn,
                },
            },
        });
    }
}
export async function deleteClassByCrn(crn) {
    await prisma.pendingCourse.deleteMany({ where: { classCrn: crn } });
    await prisma.inProgressCourse.deleteMany({ where: { classCrn: crn } });
    await prisma.completedCourse.deleteMany({ where: { classCrn: crn } });

    return prisma.class.delete({ where: { crn } });
}

export async function createClass(data) {
    return prisma.class.create({
        data,
    });
}