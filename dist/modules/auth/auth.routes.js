"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_1 = require("./auth.controller");
async function authRoutes(app) {
    const authController = new auth_controller_1.AuthController();
    app.post('/login', (request, reply) => {
        return authController.login(request, reply);
    });
}
