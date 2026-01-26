import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { TaskController } from "./tasks.controller";


const controller = new TaskController();

export async function taskRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    app.post('/tasks', controller.create);
    app.get('/tasks', controller.list);
    app.get('/leads/:id/tasks', controller.listByLead);
    app.patch('/tasks/:id/done', controller.markDone);
}