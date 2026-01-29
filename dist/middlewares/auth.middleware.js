"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const prisma_1 = require("../lib/prisma");
async function authMiddleware(request, reply) {
    try {
        await request.jwtVerify();
        const user = request.user;
        if (user?.sub) {
            // best-effort: não quebra request se DB falhar
            prisma_1.prisma.user
                .updateMany({
                where: { id: user.sub },
                data: { lastSeenAt: new Date() },
            })
                .catch(() => { });
        }
    }
    catch (err) {
        return reply.code(401).send({ message: "Nao Autorizado" });
    }
}
