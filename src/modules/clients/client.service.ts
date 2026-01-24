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
    async listByUser(userId: string) {
    return prisma.client.findMany({
        where: {
            userId,
            },
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
            },
        });
    }

    async update(id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
    }) {
        return prisma.client.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await prisma.client.delete({
            where: { id },
        });
    }
}
