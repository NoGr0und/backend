"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const prisma_1 = require("../../lib/prisma");
class LeadService {
    async create(data) {
        return prisma_1.prisma.lead.create({
            data,
        });
    }
    async listVisible(user, search, page = 1, limit = 10) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        const where = {
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
        return prisma_1.prisma.lead.findMany({
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
    async listByClientVisible(user, clientId, search, page = 1, limit = 10) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        const where = {
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
        return prisma_1.prisma.lead.findMany({
            where,
            skip,
            take: limit,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findByIdVisible(leadId, user) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        return prisma_1.prisma.lead.findFirst({
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
    async updateStatusVisible(user, id, status) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        const updated = await prisma_1.prisma.lead.updateMany({
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
        return prisma_1.prisma.lead.findFirst({
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
    async softDeleteVisible(user, id) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        return prisma_1.prisma.lead.updateMany({
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
exports.LeadService = LeadService;
