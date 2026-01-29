"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRoutes = leadRoutes;
const leads_controller_1 = require("./leads.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
async function leadRoutes(app) {
    const controller = new leads_controller_1.LeadController();
    app.post('/leads', { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => controller.create(request, reply));
    app.get('/leads', { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => controller.list(request, reply));
    app.get('/clients/:id/leads', { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => controller.listByClient(request, reply));
    app.patch('/leads/:id/status', { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => controller.updateStatus(request, reply));
    app.delete('/leads/:id', { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => controller.delete(request, reply));
}
