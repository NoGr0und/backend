"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const userController = new user_controller_1.UserController();
async function userRoutes(app) {
    // Public register
    app.post("/", userController.createUser);
    // Admin-only (empresa)
    app.get("/", { preHandler: [auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN")] }, userController.listCompanyUsers);
    app.post("/employee", { preHandler: [auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN")] }, userController.createEmployee);
    app.patch("/:id/role", { preHandler: [auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN")] }, userController.updateRole);
    app.delete("/:id", { preHandler: [auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN")] }, userController.deactivate);
}
