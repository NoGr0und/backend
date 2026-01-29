"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteService = void 0;
const prisma_1 = require("../../lib/prisma");
class NoteService {
    async createInternal(data) {
        if (!data.leadId && !data.clientId) {
            throw new Error("Nota deve estar vinculada a um lead ou client");
        }
        if (data.leadId) {
            const lead = await prisma_1.prisma.lead.findFirst({
                where: {
                    id: data.leadId,
                    companyId: data.companyId,
                    ...(data.role !== "ADMIN" ? { userId: data.userId } : {}),
                    deletedAt: null,
                },
            });
            if (!lead) {
                throw new Error("Lead não encontrado");
            }
        }
        if (data.clientId) {
            const client = await prisma_1.prisma.client.findFirst({
                where: {
                    id: data.clientId,
                    companyId: data.companyId,
                    ...(data.role !== "ADMIN" ? { userId: data.userId } : {}),
                    deletedAt: null,
                },
            });
            if (!client) {
                throw new Error("Client não encontrado");
            }
        }
        const noteData = {
            content: data.content,
            userId: data.userId,
            companyId: data.companyId,
        };
        if (data.leadId) {
            noteData.leadId = data.leadId;
        }
        if (data.clientId) {
            noteData.clientId = data.clientId;
        }
        return prisma_1.prisma.note.create({
            data: noteData,
        });
    }
    async createVisible(user, payload) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        return this.createInternal({
            ...payload,
            userId: user.sub,
            role: user.role,
            companyId: user.companyId,
        });
    }
    async listByLead(leadId, userId, search, page = 1, limit = 10) {
        const where = {
            leadId,
            userId,
            deletedAt: null,
        };
        if (search) {
            where.content = { contains: search, mode: "insensitive" };
        }
        const skip = (page - 1) * limit;
        return prisma_1.prisma.note.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async listByClient(clientId, userId, search, page = 1, limit = 10) {
        const where = {
            clientId,
            userId,
            deletedAt: null,
        };
        if (search) {
            where.content = { contains: search, mode: "insensitive" };
        }
        const skip = (page - 1) * limit;
        return prisma_1.prisma.note.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async listByLeadVisible(user, leadId, search, page = 1, limit = 10) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        const where = {
            leadId,
            companyId: user.companyId,
            deletedAt: null,
        };
        if (user.role !== "ADMIN") {
            where.userId = user.sub;
        }
        if (search) {
            where.content = { contains: search, mode: "insensitive" };
        }
        const skip = (page - 1) * limit;
        return prisma_1.prisma.note.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, name: true, email: true } } },
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
            where.content = { contains: search, mode: "insensitive" };
        }
        const skip = (page - 1) * limit;
        return prisma_1.prisma.note.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    }
    async listAllVisible(user, search, page = 1, limit = 50) {
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
            where.content = { contains: search, mode: "insensitive" };
        }
        const skip = (page - 1) * limit;
        return prisma_1.prisma.note.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async findByIdVisible(noteId, user) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        return prisma_1.prisma.note.findFirst({
            where: {
                id: noteId,
                companyId: user.companyId,
                ...(user.role !== "ADMIN" ? { userId: user.sub } : {}),
                deletedAt: null,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async softDeleteVisible(noteId, user) {
        if (!user.companyId)
            throw new Error("User sem empresa");
        return prisma_1.prisma.note.updateMany({
            where: {
                id: noteId,
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
exports.NoteService = NoteService;
