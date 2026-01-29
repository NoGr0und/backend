import { prisma } from "../../lib/prisma";

type AuthUser = { sub: string; role: string; companyId?: string | null };

export class ClientService {
    async create(data: {
        name: string;
        email?: string;
        phone?: string;
        userId: string;
        companyId: string;
    }) {
        const client = await prisma.client.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                userId: data.userId,
                companyId: data.companyId,
            },
        });
        return client;
    }
    async listVisible(user: AuthUser, search?: string, page = 1, limit = 10) {
    if (!user.companyId) {
        throw new Error("User sem empresa");
    }
    const where: {
        companyId: string;
        userId?: string;
        deletedAt: Date | null;
        name?: { contains: string; mode: "insensitive" };
    } = {
        companyId: user.companyId,
        deletedAt: null,
    };

    if (user.role !== "ADMIN") {
        where.userId = user.sub;
    }

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
        include: {
            User: {
                select: { id: true, name: true, email: true },
            },
        },
        });
    }

    async findByIdVisible(clientId: string, user: AuthUser) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        return prisma.client.findFirst({
            where: {
                id: clientId,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            include: {
                User: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async updateVisible(id: string, user: AuthUser, data: {
        name?: string;
        email?: string;
        phone?: string;
    }) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        const updated = await prisma.client.updateMany({
            where: {
                id,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            data,
        });

        if (updated.count === 0) {
            return null;
        }

        return prisma.client.findFirst({
            where: {
                id,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            include: {
                User: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async deleteVisible(id: string, user: AuthUser) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        await prisma.client.updateMany({
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
