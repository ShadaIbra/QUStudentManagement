import prisma from './prisma.js';

export async function getAllCategories() {
    return prisma.category.findMany();
}
