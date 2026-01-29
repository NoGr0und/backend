import { FastifyInstance } from "fastify";
import { NoteController } from "./notes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const controller = new NoteController();

export async function noteRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.post("/notes", controller.create);
  app.get("/notes", (request, reply) => controller.listAll(request, reply));
  app.get("/leads/:id/notes", (request, reply) =>
    controller.listByLead(request, reply)
  );
  app.get("/clients/:id/notes", (request, reply) =>
    controller.listByClient(request, reply)
  );
  app.delete("/notes/:id", controller.delete);
}
