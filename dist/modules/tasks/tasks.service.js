"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const prisma_1 = require("../../lib/prisma");
const validStatus = ['PENDING', 'DONE'];
const validTypes = ['CALL', 'EMAIL', 'MEETING', 'FOLLOW_UP'];
class TaskService {
    async create(data) {
        if (!validTypes.includes(data.type)) {
            throw new Error('Tipo de task invalido');
        }
        const lead = await prisma_1.prisma.lead.findFirst({
            where: {
                id: data.leadId,
                userId: data.userId,
            },
        });
        if (!lead) {
            throw new Error('Lead nao encontrado');
        }
        return prisma_1.prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                dueDate: data.dueDate,
                leadId: data.leadId,
                userId: data.userId
            },
        });
    }
    async listByUser(userId) {
        return prisma_1.prisma.task.findMany({
            where: { userId },
            orderBy: { dueDate: 'asc' }
        });
    }
    async listByLead(leadId, userId) {
        return prisma_1.prisma.task.findMany({
            where: {
                leadId,
                userId,
            },
        });
    }
    async markAsDone(taskId, userId) {
        const task = await prisma_1.prisma.task.findFirst({
            where: {
                id: taskId,
                userId,
            },
        });
        if (!task) {
            throw new Error('Task nao encontrada');
        }
        const updated = await prisma_1.prisma.task.updateMany({
            where: { id: taskId, userId },
            data: { status: 'DONE' },
        });
        if (updated.count === 0) {
            throw new Error('Task nao encontrada');
        }
        return prisma_1.prisma.task.findFirst({
            where: { id: taskId, userId },
        });
    }
}
exports.TaskService = TaskService;
