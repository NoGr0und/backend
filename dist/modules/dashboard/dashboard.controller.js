"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
    async index(request, reply) {
        const user = request.user;
        const metrics = await dashboard_service_1.DashboardService.getMetrics(user);
        return reply.send(metrics);
    }
}
exports.DashboardController = DashboardController;
