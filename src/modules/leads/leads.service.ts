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

    async listByUser(userId: string) {
        return prisma.lead.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async listByClient(clientId: string, userId: string) {
        return prisma.lead.findMany({
            where: {
                clientId,
                userId,
            },
        });
    }

    async findById(leadId: string, userId: string) {
        return prisma.lead.findFirst({
            where: {
                id: leadId,
                userId,
            },
        });
    }

    async updateStatus(id: string, status: string) {
        return prisma.lead.update({
            where: { id },
            data: { status },
        });
    }
}