import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Create categories
    const categories = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            prisma.category.create({
                data: { categoryName: faker.lorem.slug() },
            })
        )
    );

    // Create expertise areas
    const expertiseAreas = await Promise.all(
        Array.from({ length: 50 }).map(() =>
            prisma.expertiseArea.create({
                data: { area: faker.name.jobArea() },
            })
        )
    );

    // Create instructors
    const instructors = [];
    for (let i = 0; i < 50; i++) {
        const id = faker.string.uuid();
        const email = faker.internet.email().toLowerCase();

        await prisma.user.create({
            data: {
                id,
                email,
                password: faker.internet.password(),
                userType: 'INSTRUCTOR',
            },
        });

        const instructor = await prisma.instructor.create({
            data: {
                id,
                name: faker.person.fullName(),
                expertiseAreas: {
                    connect: faker.helpers
                        .arrayElements(expertiseAreas, faker.number.int({ min: 1, max: 3 }))
                        .map((ea) => ({ id: ea.id })),
                },
            },
        });

        instructors.push(instructor);
    }

    // Create admins
    for (let i = 0; i < 50; i++) {
        const id = faker.string.uuid();
        const email = faker.internet.email().toLowerCase();

        await prisma.user.create({
            data: {
                id,
                email,
                password: faker.internet.password(),
                userType: 'ADMIN',
            },
        });

        await prisma.admin.create({
            data: {
                id,
                name: faker.person.fullName(),
            },
        });
    }

    // Create students
    const studentIds = [];
    for (let i = 0; i < 500; i++) {
        const id = faker.string.uuid();
        const email = faker.internet.email().toLowerCase();

        await prisma.user.create({
            data: {
                id,
                email,
                password: faker.internet.password(),
                userType: 'STUDENT',
            },
        });

        await prisma.student.create({
            data: {
                id,
                name: faker.person.fullName(),
            },
        });

        studentIds.push(id);
    }

    // Create courses
    const courses = [];
    for (let i = 0; i < 50; i++) {
        const code = faker.string.alphanumeric(8);
        const course = await prisma.course.create({
            data: {
                code,
                name: faker.word.words(2),
                categoryName: faker.helpers.arrayElement(categories).categoryName,
                preferenceOpen: true,
                preferenceList: {
                    connect: faker.helpers
                        .arrayElements(instructors, faker.number.int({ min: 1, max: 3 }))
                        .map((inst) => ({ id: inst.id })),
                },
            },
        });

        // Add 1-2 prerequisites from earlier courses
        if (courses.length >= 2) {
            const prereqs = faker.helpers.arrayElements(courses, faker.number.int({ min: 1, max: 2 }));
            for (const prereq of prereqs) {
                await prisma.coursePrerequisite.create({
                    data: {
                        courseCode: course.code,
                        prerequisiteCode: prereq.code,
                    },
                });
            }
        }

        courses.push(course);
    }

    // Create 2–3 classes per course
    const validatedClasses = [];
    const unvalidatedClasses = [];

    for (const course of courses) {
        const numClasses = faker.number.int({ min: 2, max: 3 });

        for (let i = 0; i < numClasses; i++) {
            const instructor = faker.helpers.arrayElement(instructors);
            const validated = faker.datatype.boolean();

            const newClass = await prisma.class.create({
                data: {
                    crn: faker.string.alphanumeric(5).toUpperCase(),
                    instructorId: instructor.id,
                    totalSeats: faker.number.int({ min: 20, max: 50 }),
                    status: validated ? 'INPROGRESS' : 'PENDING',
                    validated,
                    code: course.code,
                },
            });

            const classEntry = { courseCode: course.code };

            validated ? validatedClasses.push(classEntry) : unvalidatedClasses.push(classEntry);
        }
    }

    // Assign courses to students
    for (const studentId of studentIds) {
        const pending = faker.helpers.arrayElements(unvalidatedClasses, 4);
        for (const c of pending) {
            try {
                await prisma.pendingCourse.create({
                    data: {
                        studentId,
                        courseCode: c.courseCode,
                    },
                });
            } catch { }
        }

        const inProgress = faker.helpers.arrayElements(validatedClasses, 5);
        for (const c of inProgress) {
            try {
                await prisma.inProgressCourse.create({
                    data: {
                        studentId,
                        courseCode: c.courseCode,
                    },
                });
            } catch { }
        }

        const completed = faker.helpers.arrayElements(validatedClasses, 25);
        for (const c of completed) {
            try {
                await prisma.completedCourse.create({
                    data: {
                        studentId,
                        courseCode: c.courseCode,
                    },
                });
            } catch { }
        }
    }

}

main()
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
