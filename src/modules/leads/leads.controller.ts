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
        const user = request.user as {sub: string};
        const userId = user.sub;

        if(!title) {
            return reply.status(400).send({ error: "Title is required" });
        }


        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                userId,
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
        });
        return reply.status(201).send(lead);
    }
    
    async list(request: FastifyRequest, reply: FastifyReply) {
        const user = request.user as {sub: string};
        return service.listByUser(user.sub);
    }

    async listByClient(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as {id: string};
        const user = request.user as {sub: string};
        return service.listByClient(id, user.sub);
    }

    async updateStatus(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as {id: string};
        const { status } = request.body as {status: string};
        const user = request.user as {sub: string};

        if(!status || !VALID_STATUS.includes(status)) {
            return reply.status(400).send({ error: "Invalid status" });
        }

        const lead = await service.findById(id, user.sub);

        if(!lead) {
            return reply.status(404).send({ error: "Lead not found" });
        }

        const updatedLead = await service.updateStatus(id, status);
        return reply.send(updatedLead);
    }
}  