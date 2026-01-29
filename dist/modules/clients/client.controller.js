"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const client_service_1 = require("./client.service");
const service = new client_service_1.ClientService();
class ClientController {
    async create(request, reply) {
        const { name, email, phone } = request.body;
        const user = request.user;
        const userId = user.sub;
        const companyId = user.companyId;
        if (!companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        if (!name) {
            return reply.status(400).send({ message: "Name is required" });
        }
        const client = await service.create({ name, email, phone, userId, companyId });
        return reply.status(201).send(client);
    }
    async list(request, reply) {
        const user = request.user;
        const { search, page = "1", limit = "10" } = request.query;
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return reply.status(400).send({ message: "Invalid page parameter" });
        }
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return reply.status(400).send({ message: "Invalid limit parameter" });
        }
        if (parsedLimit > 50) {
            return reply.status(400).send({ message: "Limit must be at most 50" });
        }
        return service.listVisible(user, search?.trim() || undefined, parsedPage, parsedLimit);
    }
    async update(request, reply) {
        const { id } = request.params;
        const user = request.user;
        const clientExist = await service.findByIdVisible(id, user);
        if (!clientExist) {
            return reply.status(404).send({ message: "Client not found" });
        }
        const updatedClient = await service.updateVisible(id, user, request.body);
        return reply.status(200).send(updatedClient);
    }
    async delete(request, reply) {
        const { id } = request.params;
        const user = request.user;
        const clientExist = await service.findByIdVisible(id, user);
        if (!clientExist) {
            return reply.status(404).send({ message: "Client not found" });
        }
        await service.deleteVisible(id, user);
        return reply.status(200).send({ message: "Client deleted successfully" });
    }
}
exports.ClientController = ClientController;
