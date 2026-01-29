import { FastifyRequest, FastifyReply } from "fastify";
import { LeadService } from "./leads.service";
import { prisma } from "../../lib/prisma";

const service = new LeadService();

const VALID_STATUS = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "WON"];

export class LeadController {
    async create(request: FastifyRequest, reply: FastifyReply) {
        const { title, value, status, clientId } = request.body as {
            title: string;
            value?: number;
            status?: string;
            clientId: string;
        };
        const user = request.user as { sub: string; role: string; companyId?: string | null };
        const userId = user.sub;
        const companyId = user.companyId;
        if (!companyId) {
            return reply.status(400).send({ error: "User sem empresa" });
        }

        if(!title) {
            return reply.status(400).send({ error: "Title is required" });
        }


        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                companyId,
                ...(user.role !== "ADMIN" ? { userId } : {}),
                deletedAt: null,
            },
        });

        if(!client) {
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
    
    async list(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as { sub: string; role: string; companyId?: string | null };
        const { search, page = "1", limit = "10" } = request.query as {
            search?: string;
            page?: string;
            limit?: string;
        };

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

        return service.listVisible(
            user,
            search?.trim() || undefined,
            parsedPage,
            parsedLimit
        );
    }

    async listByClient(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as {id: string};
        const user = request.user as { sub: string; role: string; companyId?: string | null };
        const { search, page = "1", limit = "10" } = request.query as {
            search?: string;
            page?: string;
            limit?: string;
        };

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

        return service.listByClientVisible(
            user,
            id,
            search?.trim() || undefined,
            parsedPage,
            parsedLimit
        );
    }

    async updateStatus(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as {id: string};
        const { status } = request.body as {status: string};
        const user = request.user as { sub: string; role: string; companyId?: string | null };

        if(!status || !VALID_STATUS.includes(status)) {
            return reply.status(400).send({ error: "Invalid status" });
        }

        const lead = await service.findByIdVisible(id, user);

        if(!lead) {
            return reply.status(404).send({ error: "Lead not found" });
        }

        const updatedLead = await service.updateStatusVisible(user, id, status);
        return reply.send(updatedLead);
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as {id: string};
        const user = request.user as { sub: string; role: string; companyId?: string | null };

        const lead = await service.findByIdVisible(id, user);
        if(!lead) {
            return reply.status(404).send({ error: "Lead not found" });
        }

        await service.softDeleteVisible(user, id);
        return reply.status(200).send({ message: "Lead deleted successfully" });
    }
}  
