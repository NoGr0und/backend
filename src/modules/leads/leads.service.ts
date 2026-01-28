import { prisma } from "../../lib/prisma";

export class LeadService {
    async create(data: {
        title: string;
        value?: number;
        status: string;
        clientId: string;
        userId: string;
    }) {
        return prisma.lead.create({
            data,
        });
    }

    async listByUser(userId: string, search?: string, page = 1, limit = 10) {
        const where: { userId: string; deletedAt: Date | null; title?: { contains: string; mode: "insensitive" } } = {
            userId,
            deletedAt: null,
        };

        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        const skip = (page - 1) * limit;

        return prisma.lead.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async listByClient(clientId: string, userId: string, search?: string, page = 1, limit = 10) {
        const where: { clientId: string; userId: string; deletedAt: Date | null; title?: { contains: string; mode: "insensitive" } } = {
            clientId,
            userId,
            deletedAt: null,
        };

        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        const skip = (page - 1) * limit;

        return prisma.lead.findMany({
            where,
            skip,
            take: limit,
        });
    }

    async findById(leadId: string, userId: string) {
        return prisma.lead.findFirst({
            where: {
                id: leadId,
                userId,
                deletedAt: null,
            },
        });
    }

    async updateStatus(id: string, userId: string, status: string) {
        const updated = await prisma.lead.updateMany({
            where: { id, userId, deletedAt: null },
            data: { status },
        });

        if (updated.count === 0) {
            return null;
        }

        return prisma.lead.findFirst({
            where: { id, userId, deletedAt: null },
        });
    }

    async softDelete(id: string, userId: string) {
        return prisma.lead.updateMany({
            where: { id, userId, deletedAt: null },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
