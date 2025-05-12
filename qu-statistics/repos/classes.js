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
                include: { coursePrerequisites: true, }
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