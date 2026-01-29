import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    const user = request.user as { sub?: string };
    if (user?.sub) {
      // best-effort: não quebra request se DB falhar
      prisma.user
        .updateMany({
          where: { id: user.sub },
          data: { lastSeenAt: new Date() },
        })
        .catch(() => {});
    }
  } catch (err) {
    return reply.code(401).send({ message: "Nao Autorizado" });
  }
}
