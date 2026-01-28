import { FastifyInstance } from "fastify";
import { ClientController } from "./client.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export async function clientRoutes(app: FastifyInstance) {
  const controller = new ClientController();

  app.post(
    "/clients",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      return controller.create(request, reply);
    }
  );

  app.get(
    "/clients",
    { preHandler: [authMiddleware] },
    (request, reply) => controller.list(request, reply)
);

  app.put(
    "/clients/:id",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      return controller.update(request, reply);
    }
  );
  
  app.delete(
    "/clients/:id",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      return controller.delete(request, reply);
    }
  );
}
