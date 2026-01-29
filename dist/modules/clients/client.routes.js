"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = clientRoutes;
const client_controller_1 = require("./client.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
async function clientRoutes(app) {
    const controller = new client_controller_1.ClientController();
    app.post("/clients", { preHandler: [auth_middleware_1.authMiddleware] }, async (request, reply) => {
        return controller.create(request, reply);
    });
    app.get("/clients", { preHandler: [auth_middleware_1.authMiddleware] }, (request, reply) => controller.list(request, reply));
    app.put("/clients/:id", { preHandler: [auth_middleware_1.authMiddleware] }, async (request, reply) => {
        return controller.update(request, reply);
    });
    app.delete("/clients/:id", { preHandler: [auth_middleware_1.authMiddleware] }, async (request, reply) => {
        return controller.delete(request, reply);
    });
}
