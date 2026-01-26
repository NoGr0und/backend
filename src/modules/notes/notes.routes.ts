import { FastifyInstance } from 'fastify';
import { NoteController } from './notes.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const controller = new NoteController();

export async function noteRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware);

  app.post('/notes', controller.create);
  app.get('/leads/:id/notes', controller.listByLead);
  app.get('/clients/:id/notes', controller.listByClient);
}
