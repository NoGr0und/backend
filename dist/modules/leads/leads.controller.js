"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const leads_service_1 = require("./leads.service");
const prisma_1 = require("../../lib/prisma");
const service = new leads_service_1.LeadService();
const VALID_STATUS = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "WON"];
class LeadController {
    async create(request, reply) {
        const { title, value, status, clientId } = request.body;
        const user = request.user;
        const userId = user.sub;
        const companyId = user.companyId;
        if (!companyId) {
            return reply.status(400).send({ error: "User sem empresa" });
        }
        if (!title) {
            return reply.status(400).send({ error: "Title is required" });
        }
        const client = await prisma_1.prisma.client.findFirst({
            where: {
                id: clientId,
                companyId,
                ...(user.role !== "ADMIN" ? { userId } : {}),
                deletedAt: null,
            },
        });
        if (!client) {
            return reply.status(404).send({ error: "Client not found" });
        }
        const lead = await service.create({
            title,
            value,
            status: status ?? 'NEW',
            clientId,
            userId,
            companyId,
        });
        return reply.status(201).send(lead);
    }
    async list(request, reply) {
        const user = request.user;
        const { search, page = "1", limit = "10" } = request.query;
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return reply.status(400).send({ error: "Invalid page parameter" });
        }
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return reply.status(400).send({ error: "Invalid limit parameter" });
        }
        if (parsedLimit > 50) {
            return reply.status(400).send({ error: "Limit must be at most 50" });
        }
        return service.listVisible(user, search?.trim() || undefined, parsedPage, parsedLimit);
    }
    async listByClient(request, reply) {
        const { id } = request.params;
        const user = request.user;
        const { search, page = "1", limit = "10" } = request.query;
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return reply.status(400).send({ error: "Invalid page parameter" });
        }
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return reply.status(400).send({ error: "Invalid limit parameter" });
        }
        if (parsedLimit > 50) {
            return reply.status(400).send({ error: "Limit must be at most 50" });
        }
        return service.listByClientVisible(user, id, search?.trim() || undefined, parsedPage, parsedLimit);
    }
    async updateStatus(request, reply) {
        const { id } = request.params;
        const { status } = request.body;
        const user = request.user;
        if (!status || !VALID_STATUS.includes(status)) {
            return reply.status(400).send({ error: "Invalid status" });
        }
        const lead = await service.findByIdVisible(id, user);
        if (!lead) {
            return reply.status(404).send({ error: "Lead not found" });
        }
        const updatedLead = await service.updateStatusVisible(user, id, status);
        return reply.send(updatedLead);
    }
    async delete(request, reply) {
        const { id } = request.params;
        const user = request.user;
        const lead = await service.findByIdVisible(id, user);
        if (!lead) {
            return reply.status(404).send({ error: "Lead not found" });
        }
        await service.softDeleteVisible(user, id);
        return reply.status(200).send({ message: "Lead deleted successfully" });
    }
}
exports.LeadController = LeadController;
