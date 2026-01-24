import { FastifyInstance } from "fastify";
import { LeadController } from "./leads.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";


export async function leadRoutes(app: FastifyInstance) {

const controller = new LeadController();

    app.post('/leads', {preHandler: authMiddleware},
        (request, reply) => controller.create(request, reply)
    );

    app.get('/leads', {preHandler: authMiddleware},
        (request, reply) => controller.list(request, reply)
    );

    app.get('/clients/:id/leads', {preHandler: authMiddleware},
        (request, reply) => controller.listByClient(request, reply)
    );

    app.patch('/leads/:id/status', {preHandler: authMiddleware},
        (request, reply) => controller.updateStatus(request, reply)
    );
}
