"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const tasks_service_1 = require("./tasks.service");
const taskService = new tasks_service_1.TaskService();
class TaskController {
    async create(request, reply) {
        const { title, description, type, dueDate, leadId } = request.body;
        const user = request.user;
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
    async list(request) {
        const user = request.user;
        return taskService.listByUser(user.sub);
    }
    async listByLead(request) {
        const user = request.user;
        const { id } = request.params;
        return taskService.listByLead(id, user.sub);
    }
    async markDone(request) {
        const { id } = request.params;
        const user = request.user;
        return taskService.markAsDone(id, user.sub);
    }
}
exports.TaskController = TaskController;
