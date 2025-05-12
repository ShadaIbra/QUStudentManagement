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