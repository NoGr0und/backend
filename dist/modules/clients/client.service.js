"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const prisma_1 = require("../../lib/prisma");
class ClientService {
    async create(data) {
        const client = await prisma_1.prisma.client.create({
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
    async listVisible(user, search, page = 1, limit = 10) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        const where = {
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
        return prisma_1.prisma.client.findMany({
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
    async findByIdVisible(clientId, user) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        return prisma_1.prisma.client.findFirst({
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
    async updateVisible(id, user, data) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        const updated = await prisma_1.prisma.client.updateMany({
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
        return prisma_1.prisma.client.findFirst({
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
    async deleteVisible(id, user) {
        if (!user.companyId) {
            throw new Error("User sem empresa");
        }
        await prisma_1.prisma.client.updateMany({
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
exports.ClientService = ClientService;
