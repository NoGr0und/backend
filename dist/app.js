"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const user_routes_1 = require("./modules/users/user.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const client_routes_1 = require("./modules/clients/client.routes");
const leads_routes_1 = require("./modules/leads/leads.routes");
const tasks_routes_1 = require("./modules/tasks/tasks.routes");
const notes_routes_1 = require("./modules/notes/notes.routes");
const dashboard_routes_1 = require("./modules/dashboard/dashboard.routes");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const user_controller_1 = require("./modules/users/user.controller");
exports.app = (0, fastify_1.default)({
    logger: true,
});
exports.app.register(cors_1.default, {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
exports.app.register(jwt_1.default, { secret: process.env.JWT_SECRET });
exports.app.register(user_routes_1.userRoutes, { prefix: "/user" });
exports.app.register(client_routes_1.clientRoutes);
exports.app.register(leads_routes_1.leadRoutes);
exports.app.register(tasks_routes_1.taskRoutes);
exports.app.register(auth_routes_1.authRoutes, { prefix: "/auth" });
exports.app.register(notes_routes_1.noteRoutes);
exports.app.register(dashboard_routes_1.dashboardRoutes);
const userController = new user_controller_1.UserController();
exports.app.get("/me", { preHandler: auth_middleware_1.authMiddleware }, (request, reply) => {
    return userController.me(request, reply);
});
exports.app.get("/health", async () => {
    return { status: "ok" };
});
