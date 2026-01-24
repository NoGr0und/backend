import { FastifyRequest, FastifyReply } from "fastify";

export function roleMiddleware(role: 'ADMIN' | 'USER') {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user as { role: string };

        if (!user || user.role !== role) {
            return reply.status(403).send({ message: 'Acesso negado' });
        }
    };
} 