import { prisma } from "../../lib/prisma";

type AuthUser = { sub: string; role: string; companyId?: string | null };

export class LeadService {
    async create(data: {
        title: string;
        value?: number;
        status: string;
        clientId: string;
        userId: string;
        companyId: string;
    }) {
        return prisma.lead.create({
            data,
        });
    }

    async listVisible(user: AuthUser, search?: string, page = 1, limit = 10) {
        if (!user.companyId) throw new Error("User sem empresa");
        const where: {
            companyId: string;
            userId?: string;
            deletedAt: Date | null;
            title?: { contains: string; mode: "insensitive" };
        } = {
            companyId: user.companyId,
            deletedAt: null,
        };

        if (user.role !== "ADMIN") {
            where.userId = user.sub;
        }

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
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async listByClientVisible(user: AuthUser, clientId: string, search?: string, page = 1, limit = 10) {
        if (!user.companyId) throw new Error("User sem empresa");
        const where: {
            clientId: string;
            companyId: string;
            userId?: string;
            deletedAt: Date | null;
            title?: { contains: string; mode: "insensitive" };
        } = {
            clientId,
            companyId: user.companyId,
            deletedAt: null,
        };

        if (user.role !== "ADMIN") {
            where.userId = user.sub;
        }

        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        const skip = (page - 1) * limit;

        return prisma.lead.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async findByIdVisible(leadId: string, user: AuthUser) {
        if (!user.companyId) throw new Error("User sem empresa");
        return prisma.lead.findFirst({
            where: {
                id: leadId,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async updateStatusVisible(user: AuthUser, id: string, status: string) {
        if (!user.companyId) throw new Error("User sem empresa");
        const updated = await prisma.lead.updateMany({
            where: {
                id,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            data: { status },
        });

        if (updated.count === 0) {
            return null;
        }

        return prisma.lead.findFirst({
            where: {
                id,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async softDeleteVisible(user: AuthUser, id: string) {
        if (!user.companyId) throw new Error("User sem empresa");
        return prisma.lead.updateMany({
            where: {
                id,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
