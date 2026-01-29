"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const userService = new user_service_1.UserService();
class UserController {
    async createUser(request, reply) {
        const { name, email, password, companyName } = request.body;
        const user = await userService.createUser({
            name,
            email,
            password,
            companyName,
        });
        return reply.code(201).send(user);
    }
    async me(request, reply) {
        const user = request.user;
        const me = await userService.getMe(user.sub);
        if (!me) {
            return reply.status(404).send({ message: "User not found" });
        }
        return reply.send(me);
    }
    async listCompanyUsers(request, reply) {
        const authUser = request.user;
        if (!authUser.companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        const users = await userService.listUsersByCompany(authUser.companyId);
        return reply.send(users);
    }
    async createEmployee(request, reply) {
        const authUser = request.user;
        if (!authUser.companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        const { name, email, password, role } = request.body;
        const created = await userService.createEmployee({
            name,
            email,
            password,
            role: role ?? "USER",
            companyId: authUser.companyId,
        });
        return reply.code(201).send(created);
    }
    async updateRole(request, reply) {
        const authUser = request.user;
        if (!authUser.companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        const { id } = request.params;
        const { role } = request.body;
        const updated = await userService.updateRole(authUser.companyId, id, role);
        if (!updated)
            return reply.status(404).send({ message: "User not found" });
        return reply.send(updated);
    }
    async deactivate(request, reply) {
        const authUser = request.user;
        if (!authUser.companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        const { id } = request.params;
        if (id === authUser.sub) {
            return reply
                .status(400)
                .send({ message: "Nao pode desativar o proprio usuario" });
        }
        const ok = await userService.deactivateUser(authUser.companyId, id);
        if (!ok)
            return reply.status(404).send({ message: "User not found" });
        return reply.send({ message: "User deactivated" });
    }
}
exports.UserController = UserController;
