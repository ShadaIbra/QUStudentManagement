import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    const categoryNames = [
        "Technology", "Business", "Science", "Arts", "Health",
        "Engineering", "Law", "Math", "Design", "History"
    ];

    const categories = [];
    for (const name of categoryNames) {
        const category = await prisma.category.create({
            data: { categoryName: name },
        });
        categories.push(category);
    }

    const expertiseAreas = await Promise.all(
        Array.from({ length: 50 }).map(() =>
            prisma.expertiseArea.create({
                data: {
                    area: faker.helpers.arrayElement(categoryNames),
                },
            })
        )
    );

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

    const courses = [];
    for (let i = 0; i < 100; i++) {
        const code = faker.string.alphanumeric(8);
        const course = await prisma.course.create({
            data: {
                code,
                name: faker.company.catchPhrase().split(' ').slice(0, 2).join(' '),
                categoryName: faker.helpers.arrayElement(categories).categoryName,
                preferenceOpen: true,
                preferenceList: {
                    connect: faker.helpers
                        .arrayElements(instructors, faker.number.int({ min: 1, max: 3 }))
                        .map((inst) => ({ id: inst.id })),
                },
            },
        });

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

    const classBuckets = {
        pending: [],
        inprogress: [],
        completed: []
    };

    for (const course of courses) {
        const numClasses = faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < numClasses; i++) {
            const instructor = faker.helpers.arrayElement(instructors);
            const statusType = faker.helpers.weightedArrayElement([
                { value: 'pending', weight: 1 },
                { value: 'inprogress', weight: 1 },
                { value: 'completed', weight: 5 },
            ]);
            const totalSeats = faker.number.int({ min: 20, max: 50 });

            const newClass = await prisma.class.create({
                data: {
                    crn: faker.string.alphanumeric(5).toUpperCase(),
                    instructorId: instructor.id,
                    totalSeats,
                    takenSeats: 0,
                    status: statusType.toUpperCase(),
                    validated: statusType !== 'pending',
                    code: course.code,
                },
            });

            classBuckets[statusType].push({
                classCrn: newClass.crn,
                totalSeats,
            });
        }
    }

    for (const bucket of Object.entries(classBuckets)) {
        const [statusType, classes] = bucket;
        for (const cls of classes) {
            const seatCount = faker.number.int({ min: 20, max: cls.totalSeats });
            const selectedStudents = faker.helpers.arrayElements(studentIds, seatCount);

            for (const studentId of selectedStudents) {
                try {
                    if (statusType === 'pending') {
                        await prisma.pendingCourse.create({
                            data: {
                                studentId,
                                classCrn: cls.classCrn,
                            },
                        });
                    } else if (statusType === 'inprogress') {
                        await prisma.inProgressCourse.create({
                            data: {
                                studentId,
                                classCrn: cls.classCrn,
                                grade: '-',
                            },
                        });
                    } else {
                        await prisma.completedCourse.create({
                            data: {
                                studentId,
                                classCrn: cls.classCrn,
                                grade: faker.helpers.arrayElement(['A', 'B+', 'B', 'C+', 'C', 'D']),
                            },
                        });
                    }
                } catch (err) {
                    console.error(`Failed to assign student ${studentId} to class ${cls.classCrn}:`, err);
                }
            }
        }
    }

    const allClasses = await prisma.class.findMany();

    for (const cls of allClasses) {
        const [pendingCount, inProgressCount, completedCount] = await Promise.all([
            prisma.pendingCourse.count({ where: { classCrn: cls.crn } }),
            prisma.inProgressCourse.count({ where: { classCrn: cls.crn } }),
            prisma.completedCourse.count({ where: { classCrn: cls.crn } }),
        ]);

        await prisma.class.update({
            where: { crn: cls.crn },
            data: { takenSeats: pendingCount + inProgressCount + completedCount },
        });
    }
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
