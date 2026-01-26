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

  async listByLead(request: FastifyRequest) {
    const user = request.user as { sub: string };
    const userId = user.sub;
    const { id } = request.params as { id: string };
    return noteService.listByLead(id, user.sub);
  }

  async listByClient(request: FastifyRequest) {
    const user = request.user as { sub: string };
    const userId = user.sub;
    const { id } = request.params as { id: string };
    return noteService.listByClient(id, user.sub);
  }
}
