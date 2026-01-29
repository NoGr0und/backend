import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const userController = new UserController();

export async function userRoutes(app: FastifyInstance) {
  // Public register
  app.post("/", userController.createUser);

  // Admin-only (empresa)
  app.get(
    "/",
    { preHandler: [authMiddleware, roleMiddleware("ADMIN")] },
    userController.listCompanyUsers
  );
  app.post(
    "/employee",
    { preHandler: [authMiddleware, roleMiddleware("ADMIN")] },
    userController.createEmployee
  );
  app.patch(
    "/:id/role",
    { preHandler: [authMiddleware, roleMiddleware("ADMIN")] },
    userController.updateRole
  );
  app.delete(
    "/:id",
    { preHandler: [authMiddleware, roleMiddleware("ADMIN")] },
    userController.deactivate
  );
}
