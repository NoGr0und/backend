"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const notes_service_1 = require("./notes.service");
const noteService = new notes_service_1.NoteService();
class NoteController {
    async create(request, reply) {
        const { content, leadId, clientId } = request.body;
        const user = request.user;
        if (!user.companyId) {
            return reply.status(400).send({ message: "User sem empresa" });
        }
        const note = await noteService.createVisible(user, {
            content,
            leadId,
            clientId,
        });
        return reply.status(201).send(note);
    }
    async listAll(request, reply) {
        const user = request.user;
        const { search, page = "1", limit = "50", } = request.query;
        const parsedPage = Number(page);
        const parsedLimit = Number(limit);
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return reply.status(400).send({ message: "Invalid page parameter" });
        }
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return reply.status(400).send({ message: "Invalid limit parameter" });
        }
        if (parsedLimit > 100) {
            return reply.status(400).send({ message: "Limit must be at most 100" });
        }
        const notes = await noteService.listAllVisible(user, search?.trim() || undefined, parsedPage, parsedLimit);
        return reply.send(notes);
    }
    async listByLead(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const { search, page = "1", limit = "10", } = request.query;
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
        return noteService.listByLeadVisible(user, id, search?.trim() || undefined, parsedPage, parsedLimit);
    }
    async listByClient(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const { search, page = "1", limit = "10", } = request.query;
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
        return noteService.listByClientVisible(user, id, search?.trim() || undefined, parsedPage, parsedLimit);
    }
    async delete(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const note = await noteService.findByIdVisible(id, user);
        if (!note) {
            return reply.status(404).send({ message: "Note not found" });
        }
        await noteService.softDeleteVisible(id, user);
        return reply.status(200).send({ message: "Note deleted successfully" });
    }
}
exports.NoteController = NoteController;
