"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(role) {
    return async (request, reply) => {
        const user = request.user;
        if (!user || user.role !== role) {
            return reply.status(403).send({ message: 'Acesso negado' });
        }
    };
}
