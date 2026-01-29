import { FastifyReply, FastifyRequest } from "fastify";
import { TaskService } from "./tasks.service";


const taskService = new TaskService();

export class TaskController {
    async create(request: FastifyRequest, reply: FastifyReply) {
        const {title, description, type, dueDate, leadId} = 
        request.body as any;
        const user = request.user as {sub: string,}

        const task = await taskService.create({
            title,
            description,
            type,
            dueDate: new Date(dueDate),
            leadId,
            userId: user.sub,
        });

        return reply.status(201).send(task);
    }

    async list(request: FastifyRequest) {
        const user = request.user as {sub: string}

        return taskService.listByUser(user.sub)
    }

    async listByLead(request: FastifyRequest){
        const user = request.user as {sub: string}

        const { id } = request.params as { id: string,};
        return taskService.listByLead(id, user.sub)
    }

    async markDone(request: FastifyRequest) {
        const { id } = request.params as { id: string,};
        const user = request.user as {sub: string,}

        return taskService.markAsDone(id, user.sub);
    }
}
