import { prisma } from "../../lib/prisma";

export class ClientService {
    async create(data: {
        name: string;
        email?: string;
        phone?: string;
        userId: string;
    }) {
        const client = await prisma.client.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                userId: data.userId,
            },
        });
        return client;
    }
    async listByUser(userId: string, search?: string, page = 1, limit = 10) {
    const where: { userId: string; deletedAt: Date | null; name?: { contains: string; mode: "insensitive" } } = {
        userId,
        deletedAt: null,
    };

    if (search) {
        where.name = { contains: search, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    return prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
            },
        });
    }

    async findById(clientId: string, userId: string) {
        return prisma.client.findFirst({
            where: {
                id: clientId,
                userId,
                deletedAt: null,
            },
        });
    }

    async update(id: string, userId: string, data: {
        name?: string;
        email?: string;
        phone?: string;
    }) {
        const updated = await prisma.client.updateMany({
            where: { id, userId, deletedAt: null },
            data,
        });

        if (updated.count === 0) {
            return null;
        }

        return prisma.client.findFirst({
            where: { id, userId, deletedAt: null },
        });
    }

    async delete(id: string, userId: string) {
        await prisma.client.updateMany({
            where: { id, userId, deletedAt: null },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
