"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = dashboardRoutes;
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
async function dashboardRoutes(app) {
    const controller = new dashboard_controller_1.DashboardController();
    app.get('/dashboard', { preHandler: auth_middleware_1.authMiddleware }, controller.index);
}
