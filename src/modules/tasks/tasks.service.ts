import { prisma } from "../../lib/prisma";

const validStatus = ['PENDING', 'DONE'];
const validTypes = ['CALL', 'EMAIL', 'MEETING', 'FOLLOW_UP'];

export class TaskService {
    async create(data: {
        title: string;
        description: string;
        type: string;
        dueDate: Date;
        leadId: string;
        userId: string

    }) {
        if (!validTypes.includes(data.type)) {
            throw new Error ('Tipo de task invalido');
        }

        const lead = await prisma.lead.findFirst({
            where: {
                id: data.leadId,
                userId: data.userId,
            },
        });

        if (!lead) {
            throw new Error ('Lead nao encontrado')
        }

        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type as any,
                dueDate: data.dueDate,
                leadId: data.leadId,
                userId: data.userId
            },
        });
    }

    async listByUser(userId: string) {
        return prisma.task.findMany({
            where: {userId},
            orderBy: { dueDate: 'asc'}
        });
    }

    async listByLead(leadId: string, userId: string) {
        return prisma.task.findMany({
            where:{
                leadId,
                userId,
            },
        });
    }

    async markAsDone(taskId: string, userId: string) {
        const task = await prisma.task.findFirst({
            where:{
                id: taskId,
                userId,
            },
        });

        if(!task){
            throw new Error('Task nao encontrada');
        }

        const updated = await prisma.task.updateMany({
            where: { id: taskId, userId },
            data: { status: 'DONE'},
        });

        if (updated.count === 0) {
            throw new Error('Task nao encontrada');
        }

        return prisma.task.findFirst({
            where: { id: taskId, userId },
        });
    }
}
