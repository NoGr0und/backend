import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: [authMiddleware, roleMiddleware('ADMIN')]}, userController.list);
    app.post("/", userController.createUser);
 
}
