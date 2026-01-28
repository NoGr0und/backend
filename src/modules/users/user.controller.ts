import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
    async createUser(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as {
            name: string;
            email: string;
            password: string;
        };
        const user = await userService.createUser({ name, email, password });
        return reply.code(201).send(user);
    }

    async me(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as { sub: string };
        const me = await userService.getMe(user.sub);

        if (!me) {
            return reply.status(404).send({ message: "User not found" });
        }

        return reply.send(me);
    }
    async list(request: FastifyRequest, reply: FastifyReply) {
        const users = await userService.listUsers();
        return reply.send(users);
    }
}
