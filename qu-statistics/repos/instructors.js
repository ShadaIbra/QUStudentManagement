import prisma from './prisma.js';

export async function getInstructorById(id) {
    return prisma.instructor.findUnique({
        where: { id },
        include: {
            preferredCourses: true,
        },
    });
}

export async function addPreferredCourse(instructorId, courseCode) {
    return prisma.instructor.update({
        where: { id: instructorId },
        data: {
            preferredCourses: {
                connect: { code: courseCode },
            },
        },
    });
}

export async function removePreferredCourse(instructorId, courseCode) {
    return prisma.instructor.update({
        where: { id: instructorId },
        data: {
            preferredCourses: {
                disconnect: { code: courseCode },
            },
        },
    });
}

export async function getInstructorsByExpertise(expertiseArea) {
    return prisma.instructor.findMany({
        where: {
            expertiseAreas: {
                some: {
                    area: expertiseArea,
                },
            },
        },
    });
}

export async function getAllInstructors() {
    return prisma.instructor.findMany();
}
