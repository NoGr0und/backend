import { FastifyRequest, FastifyReply } from "fastify";
import { ClientService } from "./client.service";
const service = new ClientService();

export class ClientController {
  async create(request: FastifyRequest, reply: FastifyReply) {
   const {name, email, phone } = request.body as any;

   const user = request.user as { sub: string; role: string };
   const userId = user.sub;

   if (!name) {
     return reply.status(400).send({ message: "Name is required" });
   }

   const client = await service.create(
    { name, email, phone, userId });

   return reply.status(201).send(client);

  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string; role: string };
    const userId = user.sub;
    const { search, page = "1", limit = "10" } = request.query as {
      search?: string;
      page?: string;
      limit?: string;
    };

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return reply.status(400).send({ message: "Invalid page parameter" });
    }
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return reply.status(400).send({ message: "Invalid limit parameter" });
    }
    if (parsedLimit > 50) {
      return reply.status(400).send({ message: "Limit must be at most 50" });
    }

    return service.listByUser(
      userId,
      search?.trim() || undefined,
      parsedPage,
      parsedLimit
    );
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const user = request.user as { sub: string; role: string };
  const userId = user.sub;

  const clientExist = await service.findById(id, userId);
  if (!clientExist) {
    return reply.status(404).send({ message: "Client not found" });
  }

  const updatedClient = await service.update(id, userId, request.body as any);
  return reply.status(200).send(updatedClient);
  }

async delete (request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const user = request.user as { sub: string; role: string };
  const userId = user.sub;

  const clientExist = await service.findById(id, userId);
  if (!clientExist) {
    return reply.status(404).send({ message: "Client not found" });
  }

  await service.delete(id, userId);
  return reply.status(200).send({ message: "Client deleted successfully" });
 }
}
