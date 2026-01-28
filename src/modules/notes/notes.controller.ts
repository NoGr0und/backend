import { FastifyRequest, FastifyReply } from 'fastify';
import { NoteService } from './notes.service';

const noteService = new NoteService();

export class NoteController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { content, leadId, clientId } = request.body as {
      content: string;
      leadId?: string;
      clientId?: string;
    };

    const user = request.user as { sub: string };
    const userId = user.sub;

    const note = await noteService.create({
      content,
      leadId,
      clientId,
      userId,
    });

    return reply.status(201).send(note);
  }

  async listByLead(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string };
    const { id } = request.params as { id: string };
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

    return noteService.listByLead(
      id,
      user.sub,
      search?.trim() || undefined,
      parsedPage,
      parsedLimit
    );
  }

  async listByClient(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string };
    const { id } = request.params as { id: string };
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

    return noteService.listByClient(
      id,
      user.sub,
      search?.trim() || undefined,
      parsedPage,
      parsedLimit
    );
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { sub: string };
    const { id } = request.params as { id: string };

    const note = await noteService.findById(id, user.sub);
    if (!note) {
      return reply.status(404).send({ message: "Note not found" });
    }

    await noteService.softDelete(id, user.sub);
    return reply.status(200).send({ message: "Note deleted successfully" });
  }
}
