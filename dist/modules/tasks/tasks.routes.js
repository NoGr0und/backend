"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = taskRoutes;
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const tasks_controller_1 = require("./tasks.controller");
const controller = new tasks_controller_1.TaskController();
async function taskRoutes(app) {
    app.addHook('preHandler', auth_middleware_1.authMiddleware);
    app.post('/tasks', controller.create);
    app.get('/tasks', controller.list);
    app.get('/leads/:id/tasks', controller.listByLead);
    app.patch('/tasks/:id/done', controller.markDone);
}
