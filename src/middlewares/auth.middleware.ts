import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    console.log(typeof request.jwtVerify);
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ message: "Nao Autorizado" });
    }   
}