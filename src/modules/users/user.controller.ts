import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password, companyName } = request.body as {
      name: string;
      email: string;
      password: string;
      companyName: string;
    };
    const user = await userService.createUser({
      name,
      email,
      password,
      companyName,
    });
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
  async listCompanyUsers(request: FastifyRequest, reply: FastifyReply) {
    const authUser = request.user as {
      sub: string;
      role: string;
      companyId?: string | null;
    };
    if (!authUser.companyId) {
      return reply.status(400).send({ message: "User sem empresa" });
    }
    const users = await userService.listUsersByCompany(authUser.companyId);
    return reply.send(users);
  }

  async createEmployee(request: FastifyRequest, reply: FastifyReply) {
    const authUser = request.user as {
      sub: string;
      role: string;
      companyId?: string | null;
    };
    if (!authUser.companyId) {
      return reply.status(400).send({ message: "User sem empresa" });
    }

    const { name, email, password, role } = request.body as {
      name: string;
      email: string;
      password: string;
      role?: "ADMIN" | "USER";
    };

    const created = await userService.createEmployee({
      name,
      email,
      password,
      role: role ?? "USER",
      companyId: authUser.companyId,
    });

    return reply.code(201).send(created);
  }

  async updateRole(request: FastifyRequest, reply: FastifyReply) {
    const authUser = request.user as {
      sub: string;
      role: string;
      companyId?: string | null;
    };
    if (!authUser.companyId) {
      return reply.status(400).send({ message: "User sem empresa" });
    }
    const { id } = request.params as { id: string };
    const { role } = request.body as { role: "ADMIN" | "USER" };
    const updated = await userService.updateRole(authUser.companyId, id, role);
    if (!updated) return reply.status(404).send({ message: "User not found" });
    return reply.send(updated);
  }

  async deactivate(request: FastifyRequest, reply: FastifyReply) {
    const authUser = request.user as {
      sub: string;
      role: string;
      companyId?: string | null;
    };
    if (!authUser.companyId) {
      return reply.status(400).send({ message: "User sem empresa" });
    }
    const { id } = request.params as { id: string };
    if (id === authUser.sub) {
      return reply
        .status(400)
        .send({ message: "Nao pode desativar o proprio usuario" });
    }
    const ok = await userService.deactivateUser(authUser.companyId, id);
    if (!ok) return reply.status(404).send({ message: "User not found" });
    return reply.send({ message: "User deactivated" });
  }
}
